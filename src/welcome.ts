import readline from 'readline';

export interface WelcomeOptions {
  version?: string;
  environment?: string;
}

export class WelcomeScreen {
  private version: string;
  private environment: string;

  constructor(options: WelcomeOptions = {}) {
    this.version = options.version || '0.1.0';
    this.environment = options.environment || process.env.NODE_ENV || 'development';
  }

  public renderHeader(): void {
    console.clear();
    console.log('====================================================');
    console.log('                 Welcome to PostaAi                 ');
    console.log('      The Modern Brazilian Social Network Platform   ');
    console.log('====================================================');
    console.log(` Version: ${this.version} \vert{} Environment:${this.environment}`);
    console.log('====================================================\n');
  }

  public renderBanner(): void {
    console.log(`
      ____            _           _    _ 
     |  _ \\ ___  ___| |_ a _    / \\  (_)
     | |_) / _ \\/ __| __/ _\` |  / _ \\ | |
     |  __/ (_) \\__ \\ || (_| | / ___ \\| |
     |_|   \\___/|___/\\__\\__,_|/_/   \\_\\_|
    `);
    console.log('\n   Connect. Share moments. Discover content in real time.\n');
  }

  public renderMenu(): void {
    console.log('Please select an option to get started:');
    console.log('----------------------------------------------------');
    console.log('[1] Start Interactive CLI');
    console.log('[2] View API System Status');
    console.log('[3] Read Project Overview');
    console.log('[0] Exit Platform');
    console.log('----------------------------------------------------');
  }

  public start(): Promise<string> {
    this.renderHeader();
    this.renderBanner();
    this.renderMenu();

    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    return new Promise((resolve) => {
      rl.question('\nEnter your choice: ', (choice) => {
        rl.close();
        resolve(choice.trim());
      });
    });
  }
}

export async function bootstrapWelcome(): Promise<void> {
  const welcome = new WelcomeScreen();
  const option = await welcome.start();

  switch (option) {
    case '1':
      console.log('\nLaunching CLI Control Center...');
      break;
    case '2':
      console.log('\nSystem Status: Operational (Node.js / Express Engine)');
      break;
    case '3':
      console.log('\nPostaAi is an Instagram-style social media platform built with TypeScript.');
      break;
    case '0':
      console.log('\nGoodbye!');
      process.exit(0);
      break;
    default:
      console.log('\nInvalid choice. Exiting...');
      process.exit(1);
  }
}

if (require.main === module) {
  bootstrapWelcome();
}
