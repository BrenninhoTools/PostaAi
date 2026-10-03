import readline from 'readline';

export interface PostFeedItem {
  id: string;
  authorUsername: string;
  imageUrl: string;
  caption: string;
  likesCount: number;
  commentsCount: number;
  createdAt: Date;
}

export class HomeScreenView {
  private rl: readline.Interface;

  constructor() {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
  }

  public renderHeader(username: string): void {
    console.clear();
    console.log('====================================');
    console.log(`         PostaAi - Feed             `);
    console.log(`   Welcome back, @${username}!      `);
    console.log('====================================\n');
  }

  public renderFeed(posts: PostFeedItem[]): void {
    if (posts.length === 0) {
      console.log('No posts to display right now. Follow users to build your feed!\n');
      return;
    }

    posts.forEach((post, index) => {
      console.log(`------------------------------------`);
      console.log(`[${index + 1}] @${post.authorUsername}`);
      console.log(`Media: ${post.imageUrl}`);
      console.log(`Caption: ${post.caption}`);
      console.log(`❤️  ${post.likesCount} likes | 💬 ${post.commentsCount} comments`);
      console.log(`Posted at: ${post.createdAt.toLocaleString()}`);
      console.log(`------------------------------------\n`);
    });
  }

  public renderNavigationOptions(): void {
    console.log('====================================');
    console.log('[1] Refresh Feed');
    console.log('[2] Create New Post');
    console.log('[3] View Notifications');
    console.log('[4] Search Users / Tags');
    console.log('[5] My Profile');
    console.log('[0] Back to Main Menu');
    console.log('====================================');
  }

  public async showHomeScreen(username: string, samplePosts: PostFeedItem[]): Promise<void> {
    this.renderHeader(username);
    this.renderFeed(samplePosts);
    this.renderNavigationOptions();

    return new Promise((resolve) => {
      this.rl.question('\nSelect an option: ', (choice) => {
        const option = choice.trim();
        console.log(`Selected option: ${option}`);
        this.rl.close();
        resolve();
      });
    });
  }
}

export function displayHomeScreen(): void {
  const mockPosts: PostFeedItem[] = [
    {
      id: 'post-1',
      authorUsername: 'brenninho',
      imageUrl: 'https://storage.posta.ai/images/photo1.jpg',
      caption: 'Building the new PostaAi backend in TypeScript! 🚀',
      likesCount: 42,
      commentsCount: 5,
      createdAt: new Date()
    },
    {
      id: 'post-2',
      authorUsername: 'dev_community',
      imageUrl: 'https://storage.posta.ai/images/setup.jpg',
      caption: 'Workspace check. Ready for coding sessions.',
      likesCount: 128,
      commentsCount: 19,
      createdAt: new Date(Date.now() - 3600000)
    }
  ];

  const homeScreen = new HomeScreenView();
  homeScreen.showHomeScreen('brenninho', mockPosts);
}

if (require.main === module) {
  displayHomeScreen();
}
