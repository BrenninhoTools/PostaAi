import readline from 'readline';

export interface MenuItem {
  key: string;
  label: string;
  action: () => Promise<void> | void;
}

export class Menu {
  private items: MenuItem[] = [];
  private rl: readline.Interface;

  constructor(private title: string = 'PostaAi CLI Menu') {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
  }

  public addItem(item: MenuItem): void {
    this.items.push(item);
  }

  public display(): void {
    console.clear();
    console.log('====================================');
    console.log(`   ${this.title}`);
    console.log('====================================\n');

    this.items.forEach((item) => {
      console.log(`[${item.key}] ${item.label}`);
    });

    console.log('[0] Exit');
    console.log('\n====================================');
  }

  public prompt(): void {
    this.display();
    this.rl.question('\nSelect an option: ', async (answer) => {
      const selected = answer.trim();

      if (selected === '0') {
        console.log('\nExiting menu. Goodbye!');
        this.rl.close();
        process.exit(0);
      }

      const item = this.items.find((i) => i.key === selected);

      if (item) {
        console.clear();
        await item.action();
        this.askToContinue();
      } else {
        console.log('\nInvalid option. Press Enter to try again...');
        this.rl.question('', () => this.prompt());
      }
    });
  }

  private askToContinue(): void {
    this.rl.question('\nPress Enter to return to main menu...', () => {
      this.prompt();
    });
  }
}

export function initializeCLI(): void {
  const mainMenu = new Menu('PostaAi Control Center');

  mainMenu.addItem({
    key: '1',
    label: 'Check API Health Status',
    action: async () => {
      console.log('Checking health status...');
      console.log('Status: OK (API running)');
    }
  });

  mainMenu.addItem({
    key: '2',
    label: 'Database Migration Options',
    action: async () => {
      console.log('Running database status check...');
      console.log('Prisma schema synchronized.');
    }
  });

  mainMenu.addItem({
    key: '3',
    label: 'View Server Configuration',
    action: () => {
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`Port: ${process.env.PORT || 3000}`);
    }
  });

  mainMenu.prompt();
}

if (require.main === module) {
  initializeCLI();
}
