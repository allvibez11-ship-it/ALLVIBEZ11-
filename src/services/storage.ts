import {
  Article,
  Category,
  PopUpSettings,
  MonetagSettings,
  GoogleVerificationSettings,
  SEOSettings,
  WebsiteSettings,
  User,
  MediaItem,
  ActivityLog,
  PublicSettingsPayload,
} from '../types';
import { supabase, isSupabaseConfigured } from '../supabase';

const STORAGE_KEY = 'allvibez11_local_database_v2';
const ADMIN_TOKEN_KEY = 'allvibez11_admin_token';
const VISITOR_TOKEN_KEY = 'allvibez11_visitor_token';

const DEFAULT_CATEGORIES: Category[] = [
  { id: 'cat-music', name: 'Music', slug: 'music', description: 'Latest single drops, albums, chart tracking, and music industry news.', color: 'from-amber-500 to-orange-600' },
  { id: 'cat-musicians', name: 'Musicians', slug: 'musicians', description: 'Artist profiles, interviews, tours, and behind-the-scenes stories.', color: 'from-orange-500 to-rose-600' },
  { id: 'cat-movies', name: 'Movies', slug: 'movies', description: 'Box office scoops, film reviews, movie releases, and festival highlights.', color: 'from-rose-500 to-pink-600' },
  { id: 'cat-actors', name: 'Actors & Actresses', slug: 'actors', description: 'Profiles and career milestones of leading movie stars worldwide.', color: 'from-purple-500 to-indigo-600' },
  { id: 'cat-nollywood', name: 'Nollywood', slug: 'nollywood', description: 'The beating heart of African cinema, indigenous films, and record-breakers.', color: 'from-emerald-500 to-teal-600' },
  { id: 'cat-hollywood', name: 'Hollywood', slug: 'hollywood', description: 'Global cinema blockbusters, Oscars, celebrity lifestyle, and studio updates.', color: 'from-blue-500 to-cyan-600' },
  { id: 'cat-celebrity', name: 'Celebrity News', slug: 'celebrity-news', description: 'Trending celebrity scoops, red carpet fashion, and exclusive gossip.', color: 'from-fuchsia-500 to-pink-600' },
  { id: 'cat-trending', name: 'Trending Stories', slug: 'trending', description: 'Viral pop culture moments, social media buzz, and hot debates.', color: 'from-amber-400 to-red-500' },
];

const INITIAL_ARTICLES: Article[] = [
  {
    id: 'art-1',
    title: 'Burna Boy Announces Record-Breaking Global Stadium Tour for 2026',
    slug: 'burna-boy-record-breaking-global-stadium-tour-2026',
    subtitle: 'The African Giant is set to headline historic arenas in London, New York, Paris, and Lagos with an immersive sonic spectacle.',
    excerpt: 'Grammy-winning Afrobeats titan Burna Boy has officially detailed his monumental upcoming world stadium tour, bringing African rhythms to unprecedented global stages.',
    content: `
      <p class="lead">In an electrifying announcement that sent shockwaves through the global music community, Grammy Award-winning Nigerian superstar Burna Boy has revealed the dates and venues for his most ambitious world tour to date: <strong>"Spaceship Odyssey 2026"</strong>.</p>
      
      <h2>Unprecedented Arenas and Staging</h2>
      <p>Following historical sold-out shows at London Stadium, Citi Field in New York, and Paris La Défense Arena, Burna Boy is taking production values to astronomical heights. The tour features custom circular 360-degree floating stages, live traditional percussionists from West Africa, and a 40-piece brass orchestra.</p>
      
      <blockquote>"Our sound has no borders. African music is not a wave; it is an ocean that continues to nourish the entire planet. We are bringing home to the world." — Burna Boy</blockquote>
      
      <h2>Supporting Acts and Collaboration Highlights</h2>
      <p>Insiders confirm that special guest performances are being planned with frequent collaborators including Stormzy, Chris Martin of Coldplay, and Angelique Kidjo. Tickets are projected to sell out within minutes of the pre-sale window opening this Friday.</p>
      
      <h3>Tour Highlights & Milestone Stops:</h3>
      <ul>
        <li><strong>London:</strong> Wembley Stadium (2 consecutive nights)</li>
        <li><strong>New York:</strong> MetLife Stadium</li>
        <li><strong>Lagos:</strong> National Stadium Spectacular</li>
        <li><strong>Johannesburg:</strong> FNB Stadium</li>
      </ul>
      
      <p>With Afrobeats dominating streaming charts and reshaping contemporary pop music, Burna Boy's continued evolution proves that African creative excellence continues to command the grandest stages on Earth.</p>
    `,
    featuredImage: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80',
    imageCaption: 'Burna Boy commanding a crowd of over 80,000 enthusiastic fans under neon stadium lights.',
    category: 'music',
    categoryName: 'Music',
    tags: ['Burna Boy', 'Afrobeats', 'Stadium Tour', 'Music News', 'Live Concerts'],
    authorName: 'Tunde Adeleke',
    status: 'published',
    featured: true,
    breaking: true,
    trending: true,
    publishedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    views: 4820,
    likes: 394,
    seoTitle: 'Burna Boy Announces Historic 2026 Global Stadium Tour | ALLVIBEZ11',
    metaDescription: 'Get all the dates, ticket details, and venue announcements for Burna Boy\'s record-breaking 2026 stadium tour across London, New York, and Lagos.',
    createdAt: new Date(Date.now() - 3600000 * 3).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'art-2',
    title: 'Funke Akindele Breaks All Nollywood Box Office Records with New Epic Thriller',
    slug: 'funke-akindele-breaks-all-nollywood-box-office-records',
    subtitle: 'The visionary filmmaker crosses historic gross revenue milestones in under three weeks of theatrical release.',
    excerpt: 'Nollywood box office queen Funke Akindele has once again rewritten cinema history, with her latest action-drama grossing over 1.8 billion Naira.',
    content: `
      <p class="lead">Nollywood filmmaker and creative powerhouse <strong>Funke Akindele</strong> has shattered all existing West African box office milestones with her latest cinematic masterpiece, generating over 1.8 Billion Naira within just twenty-one days of theatrical release across Nigeria, Ghana, and the diaspora.</p>
      
      <h2>Redefining Commercial Cinema in Nigeria</h2>
      <p>The high-octane narrative, praised by critics for its razor-sharp screenplay, cinematography, and authentic cultural resonance, has dominated multiplexes with sold-out midnight screenings.</p>
      
      <p>Industry analysts point out that Akindele's marketing masterclass and deep connection with grassroots cinema-goers has fundamentally elevated the financial ceiling for Nollywood theatrical productions.</p>
      
      <blockquote>"We wanted to tell an authentic story that speaks directly to the resilience, humor, and triumph of our people. The audience embraced it with open arms." — Funke Akindele</blockquote>
      
      <h2>International Streaming and Festival Buzz</h2>
      <p>Major international streaming platforms are already locked in a competitive bidding war for exclusive post-theatrical streaming rights, further establishing Nollywood as a vital engine of global commercial storytelling.</p>
    `,
    featuredImage: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1200&q=80',
    imageCaption: 'Cinema audience and red carpet premiere for the groundbreaking Nollywood release.',
    category: 'nollywood',
    categoryName: 'Nollywood',
    tags: ['Funke Akindele', 'Nollywood', 'Box Office', 'Cinema', 'African Movies'],
    authorName: 'Chioma Okonjo',
    status: 'published',
    featured: true,
    breaking: false,
    trending: true,
    publishedAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    views: 3290,
    likes: 275,
    seoTitle: 'Funke Akindele Shatters Nollywood Box Office Records | ALLVIBEZ11',
    metaDescription: 'Read how Funke Akindele broke all Nollywood box office records with her latest blockbuster film grossing over 1.8 Billion Naira.',
    createdAt: new Date(Date.now() - 3600000 * 6).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'art-3',
    title: 'Tems and Asake Lead Stellar African Nominations at Global Music Honors',
    slug: 'tems-and-asake-lead-stellar-african-nominations',
    subtitle: 'From soulful melodies to Fujipiano rhythms, African stars dominate international award categories.',
    excerpt: 'Tems, Asake, and Ayra Starr secure prestigious honors as the world celebrates the unmatched creative depth of modern African music.',
    content: `
      <p class="lead">The nominations for the upcoming international music honors were unveiled today, showcasing an unprecedented wave of African talents across major categories including Best Global Performance, Best Album, and Best Vocal Delivery.</p>
      
      <h2>Tems: The Global Siren Continues Her Ascent</h2>
      <p>Following her critically acclaimed studio release, Tems earned nods across three key international categories. Her signature vocal texture and evocative songwriting have solidified her status as one of the defining voices of modern music.</p>
      
      <h2>Asake\'s Fujipiano Revolution</h2>
      <p>Asake\'s relentless innovation blending traditional Fuji melodies with contemporary Amapiano basslines continues to captivate worldwide critics, earning him prominent recognition for his boundary-pushing studio albums.</p>
    `,
    featuredImage: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=80',
    imageCaption: 'Stage lights illuminate a world-class live performance.',
    category: 'musicians',
    categoryName: 'Musicians',
    tags: ['Tems', 'Asake', 'Afrobeats', 'Awards', 'Global Music'],
    authorName: 'David Mensah',
    status: 'published',
    featured: false,
    breaking: false,
    trending: true,
    publishedAt: new Date(Date.now() - 3600000 * 8).toISOString(),
    views: 2150,
    likes: 180,
    seoTitle: 'Tems & Asake Dominate Global Music Nominations | ALLVIBEZ11',
    metaDescription: 'African music superstars Tems, Asake, and Ayra Starr lead major global music nominations this season. Read full coverage on ALLVIBEZ11.',
    createdAt: new Date(Date.now() - 3600000 * 9).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'art-4',
    title: 'Lupita Nyong’o & John Boyega Launch Pan-African Cinema Investment Fund',
    slug: 'lupita-nyongo-john-boyega-launch-pan-african-cinema-fund',
    subtitle: 'The multimillion-dollar initiative aims to finance independent storytellers across Nigeria, Kenya, South Africa, and Ghana.',
    excerpt: 'Academy Award winner Lupita Nyong\'o and British-Nigerian actor John Boyega have joined forces to launch a game-changing creative production fund.',
    content: `
      <p class="lead">Hollywood luminaries <strong>Lupita Nyong\'o</strong> and <strong>John Boyega</strong> have announced the formal launch of the <em>Ubora Film Collective</em>, a $50 million investment fund dedicated to developing, producing, and distributing high-budget narrative features across the African continent.</p>
      
      <h2>Bridging Hollywood Capital with Authentic African Narratives</h2>
      <p>The fund will prioritize scripts that showcase untold historical epics, contemporary sci-fi, and folklore-inspired cinematic stories created by homegrown African screenwriters and directors.</p>
      
      <blockquote>"For too long, African stories were viewed through an outside lens. It is time to provide our filmmakers with the production budgets, visual effects capabilities, and worldwide theatrical pipelines they deserve." — John Boyega</blockquote>
      
      <p>Production for the first slate of four feature films is scheduled to commence in Lagos, Nairobi, and Cape Town later this year.</p>
    `,
    featuredImage: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=1200&q=80',
    imageCaption: 'Film camera on cinema set capturing cinematic magic.',
    category: 'actors',
    categoryName: 'Actors & Actresses',
    tags: ['Lupita Nyong\'o', 'John Boyega', 'Hollywood', 'Film Fund', 'Cinema'],
    authorName: 'Chioma Okonjo',
    status: 'published',
    featured: false,
    breaking: false,
    trending: false,
    publishedAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    views: 1840,
    likes: 156,
    seoTitle: 'Lupita Nyong\'o & John Boyega Launch $50M Cinema Fund | ALLVIBEZ11',
    metaDescription: 'Hollywood stars Lupita Nyong\'o and John Boyega unveil a 50 million dollar pan-African film fund. Full details on ALLVIBEZ11.',
    createdAt: new Date(Date.now() - 3600000 * 14).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'art-5',
    title: 'Top 10 Most Anticipated Hollywood Blockbusters of the Summer Season',
    slug: 'top-10-most-anticipated-hollywood-blockbusters-summer',
    subtitle: 'From heart-stopping superhero sequels to original sci-fi epics, here is what moviegoers need to know.',
    excerpt: 'Our film critics break down the upcoming Hollywood blockbusters, box office predictions, and casting highlights.',
    content: `
      <p class="lead">As multiplexes worldwide prepare for another blockbuster season, studios are rolling out heavy-hitting franchises, gripping psychological thrillers, and stunning visual feasts.</p>
      
      <h2>Action, Adventure, and Cinematic Spectacle</h2>
      <p>From IMAX-optimized cinematography to star-studded ensemble casts, this season promises a feast for cinephiles across the globe. We rank the top releases based on anticipation, directorial vision, and early test-screening buzz.</p>
    `,
    featuredImage: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&w=1200&q=80',
    imageCaption: 'Glowing neon cinema marquee illuminating city night.',
    category: 'hollywood',
    categoryName: 'Hollywood',
    tags: ['Hollywood', 'Blockbusters', 'Summer Movies', 'Box Office', 'Reviews'],
    authorName: 'Alex Rivera',
    status: 'published',
    featured: false,
    breaking: false,
    trending: false,
    publishedAt: new Date(Date.now() - 3600000 * 20).toISOString(),
    views: 1420,
    likes: 95,
    seoTitle: 'Top 10 Most Anticipated Hollywood Blockbusters | ALLVIBEZ11',
    metaDescription: 'Discover the top 10 most anticipated Hollywood movies coming to cinemas this summer, analyzed by ALLVIBEZ11 movie critics.',
    createdAt: new Date(Date.now() - 3600000 * 22).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'art-6',
    title: 'Celebrity Red Carpet Spotlight: Glitz, Glamour, and Afro-Futuristic Couture',
    slug: 'celebrity-red-carpet-spotlight-afro-futuristic-couture',
    subtitle: 'A breakdown of the most daring fashion statements that conquered the red carpet this weekend.',
    excerpt: 'From handwoven Aso-Oke ballgowns to structural Parisian haute couture, see how celebrities set new global style standards.',
    content: `
      <p class="lead">Fashion and entertainment collided in spectacular fashion this past weekend as the red carpet transformed into a runway of breathtaking cultural elegance and avant-garde glamour.</p>
      
      <h2>Afro-Futurism Meets Met Gala Precision</h2>
      <p>Celebrity stylists turned heads by incorporating hand-dyed indigenous textiles with sculptural metallics, proving once again that African fashion aesthetics are leading the global couture conversation.</p>
    `,
    featuredImage: 'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?auto=format&fit=crop&w=1200&q=80',
    imageCaption: 'Red carpet glamour and cameras capturing iconic fashion moments.',
    category: 'celebrity-news',
    categoryName: 'Celebrity News',
    tags: ['Celebrity Style', 'Red Carpet', 'Fashion', 'Afro-Futurism', 'Gossip'],
    authorName: 'Zara Bello',
    status: 'published',
    featured: false,
    breaking: false,
    trending: true,
    publishedAt: new Date(Date.now() - 3600000 * 26).toISOString(),
    views: 2900,
    likes: 310,
    seoTitle: 'Celebrity Red Carpet Fashion & Afro-Couture Highlights | ALLVIBEZ11',
    metaDescription: 'See the most dazzling celebrity red carpet looks and style moments trending across the entertainment sphere on ALLVIBEZ11.',
    createdAt: new Date(Date.now() - 3600000 * 28).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'art-7',
    title: 'Davido and Chioma Welcome New Milestone with Heartfelt Charitable Foundation',
    slug: 'davido-and-chioma-launch-charitable-foundation-milestone',
    subtitle: 'The music icon and his wife announce a multimillion-Naira education and healthcare grant for underserved youth.',
    excerpt: 'Afrobeats megastar Davido continues his philanthropic legacy by establishing a dedicated foundation to empower young creatives across West Africa.',
    content: `
      <p class="lead">Continuing his long-standing tradition of giving back, Nigerian global music sensation <strong>Davido</strong> (David Adeleke) alongside his wife <strong>Chioma Adeleke</strong> have unveiled the Adeleke Youth Creative & Medical Support Trust.</p>
      
      <p>The endowment aims to provide university scholarships, creative production grants, and pediatric healthcare subsidies to hundreds of disadvantaged families.</p>
    `,
    featuredImage: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=80',
    imageCaption: 'Music and philanthropy unite for a historic cause.',
    category: 'celebrity-news',
    categoryName: 'Celebrity News',
    tags: ['Davido', 'Chioma', 'Philanthropy', 'Celebrity News', 'Afrobeats'],
    authorName: 'Tunde Adeleke',
    status: 'published',
    featured: false,
    breaking: false,
    trending: true,
    publishedAt: new Date(Date.now() - 3600000 * 30).toISOString(),
    views: 3870,
    likes: 420,
    seoTitle: 'Davido and Chioma Launch Multimillion Youth Endowment | ALLVIBEZ11',
    metaDescription: 'Davido and Chioma unveil a transformative charitable endowment for youth creatives and education. Read the story on ALLVIBEZ11.',
    createdAt: new Date(Date.now() - 3600000 * 32).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'art-8',
    title: 'Viral Dance Craze Takes Over TikTok with Over 500 Million Views Worldwide',
    slug: 'viral-dance-craze-takes-over-tiktok-500-million-views',
    subtitle: 'How a 15-second sound snippet created in a Lagos bedroom sparked a worldwide dance challenge.',
    excerpt: 'The intersection of internet culture, street choreography, and irresistible tempo has created the year\'s biggest viral sensation.',
    content: `
      <p class="lead">From teenagers in Tokyo to college students in London and street dancers in Lagos, a new viral choreography challenge has surpassed half a billion views on TikTok in less than two weeks.</p>
      
      <h2>The Anatomy of a Viral Hit</h2>
      <p>The song, created by an emerging teenage producer using basic bedroom equipment, features syncopated log drums and catchy vocal chops that algorithms and creators simply cannot resist.</p>
    `,
    featuredImage: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80',
    imageCaption: 'Vibrant crowd dancing and celebrating pop culture energy.',
    category: 'trending',
    categoryName: 'Trending Stories',
    tags: ['TikTok', 'Viral Dance', 'Pop Culture', 'Social Media', 'Trends'],
    authorName: 'Zara Bello',
    status: 'published',
    featured: false,
    breaking: true,
    trending: true,
    publishedAt: new Date(Date.now() - 3600000 * 36).toISOString(),
    views: 5120,
    likes: 670,
    seoTitle: 'Viral Dance Craze Explodes Across TikTok with 500M+ Views | ALLVIBEZ11',
    metaDescription: 'Inside the viral TikTok sensation that has captured the globe. Catch the latest trending culture on ALLVIBEZ11.',
    createdAt: new Date(Date.now() - 3600000 * 38).toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

export interface ClientDatabase {
  articles: Article[];
  categories: Category[];
  popUpSettings: PopUpSettings;
  monetagSettings: MonetagSettings;
  googleSettings: GoogleVerificationSettings;
  seoSettings: SEOSettings;
  websiteSettings: WebsiteSettings;
  users: User[];
  media: MediaItem[];
  activityLogs: ActivityLog[];
  visitorCount: number;
}

function getInitialClientDb(): ClientDatabase {
  return {
    articles: INITIAL_ARTICLES,
    categories: DEFAULT_CATEGORIES,
    popUpSettings: {
      enabled: false,
      smartLinkUrl: '',
      title: '🔥 Exclusive Entertainment Alert!',
      description: 'Discover the latest viral music releases, Nollywood movie leaks, and celebrity VIP updates before anyone else.',
      buttonLabel: 'Explore Trending Now',
      triggerTiming: 'delay_3s',
      frequency: 'once_per_session',
      scope: 'all_pages',
      dismissible: true,
    },
    monetagSettings: {
      verificationMethod: 'none',
      verificationMetaTag: '',
      verificationFileName: '',
      verificationFileContent: '',
      ads: {
        header: { enabled: false, code: '', label: 'Header Banner' },
        homepage: { enabled: false, code: '', label: 'Homepage Billboard' },
        sidebar: { enabled: false, code: '', label: 'Desktop Sidebar Ad' },
        insideArticle: { enabled: false, code: '', label: 'Inside Article (Mid-Content)' },
        afterArticle: { enabled: false, code: '', label: 'After Article Ad' },
        footer: { enabled: false, code: '', label: 'Sticky / Footer Ad' },
      },
    },
    googleSettings: {
      verificationMethod: 'none',
      verificationMetaTag: '',
      verificationFileName: '',
      verificationFileContent: '',
    },
    seoSettings: {
      defaultMetaTitle: 'ALLVIBEZ11 - Global & African Entertainment News, Movies, Music & Celebrities',
      defaultMetaDescription: 'ALLVIBEZ11 is the premier digital entertainment magazine for music artists, movie blockbusters, Nollywood, Hollywood, celebrity news, and trending culture.',
      keywords: 'ALLVIBEZ11, African entertainment, Afrobeats, Nollywood, Hollywood, celebrity news, musicians, movies, trending stories, pop culture',
      siteName: 'ALLVIBEZ11',
      canonicalDomain: 'https://allvibez11-ship-it.github.io/ALLVIBEZ11-/',
      twitterHandle: '@AllVibez11',
      enableSitemap: true,
      enableRobotsTxt: true,
    },
    websiteSettings: {
      siteName: 'ALLVIBEZ11',
      tagline: 'Global & African Entertainment News, Movies, Music & Celebrities',
      contactEmail: 'allvibez11@gmail.com',
      adminEmail: 'allvibez11@gmail.com',
      allowVisitorRegistration: false,
      footerAbout: 'ALLVIBEZ11 is your premier digital destination delivering non-stop breaking news, celebrity exclusives, music chart analysis, Nollywood & Hollywood blockbusters, and trending pop culture.',
      socialLinks: {
        twitter: 'https://twitter.com/allvibez11',
        instagram: 'https://instagram.com/allvibez11',
        facebook: 'https://facebook.com/allvibez11',
        youtube: 'https://youtube.com/@allvibez11',
        tiktok: 'https://tiktok.com/@allvibez11',
      },
    },
    users: [
      {
        id: 'user-admin-1',
        email: 'allvibez11@gmail.com',
        name: 'Administrator (ALLVIBEZ11)',
        role: 'admin',
        createdAt: new Date().toISOString(),
        isInitialSetupCompleted: false,
      },
    ],
    media: [
      {
        id: 'media-1',
        name: 'Burna Boy Stadium Tour',
        url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80',
        size: 342000,
        type: 'image/jpeg',
        uploadedAt: new Date().toISOString(),
      },
      {
        id: 'media-2',
        name: 'Nollywood Cinema Hall',
        url: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1200&q=80',
        size: 298000,
        type: 'image/jpeg',
        uploadedAt: new Date().toISOString(),
      },
      {
        id: 'media-3',
        name: 'Global Stage Performance',
        url: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=80',
        size: 412000,
        type: 'image/jpeg',
        uploadedAt: new Date().toISOString(),
      },
      {
        id: 'media-4',
        name: 'Lupita & Boyega Film Project',
        url: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=1200&q=80',
        size: 388000,
        type: 'image/jpeg',
        uploadedAt: new Date().toISOString(),
      },
    ],
    activityLogs: [
      {
        id: 'log-1',
        action: 'System Initialized',
        details: 'ALLVIBEZ11 entertainment engine and database bootstrapped successfully.',
        timestamp: new Date().toISOString(),
      },
    ],
    visitorCount: 14920,
  };
}

class ClientStorageManager {
  private data: ClientDatabase;

  constructor() {
    this.data = this.load();
  }

  private load(): ClientDatabase {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && Array.isArray(parsed.articles) && parsed.articles.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to parse localStorage database, creating fresh seed:', e);
    }
    const initial = getInitialClientDb();
    this.save(initial);
    return initial;
  }

  private save(data: ClientDatabase) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error('Failed to save to localStorage:', e);
    }
  }

  public get(): ClientDatabase {
    return this.data;
  }

  public update(updater: (db: ClientDatabase) => void): ClientDatabase {
    updater(this.data);
    this.save(this.data);
    return this.data;
  }

  public log(action: string, details: string) {
    this.update((db) => {
      db.activityLogs.unshift({
        id: 'log-' + Date.now(),
        action,
        details,
        timestamp: new Date().toISOString(),
      });
      if (db.activityLogs.length > 100) {
        db.activityLogs = db.activityLogs.slice(0, 100);
      }
    });
  }
}

export const clientDb = new ClientStorageManager();
