
const delay = (ms = 600) => new Promise(resolve => setTimeout(resolve, ms));

const getStorageItem = (key, defaultValue) => {
  const data = localStorage.getItem(key);
  if (!data) {
    localStorage.setItem(key, JSON.stringify(defaultValue));
    return defaultValue;
  }
  return JSON.parse(data);
};

const setStorageItem = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

const SEED_USERS = [
  {
    id: "user_1",
    username: "alex_dev",
    email: "alex@example.com",
    password: "password123",
    name: "Alex Rivera",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
    bio: "Senior Frontend Engineer & Design Enthusiast. Sharing thoughts on the future of building for the web."
  },
  {
    id: "user_2",
    username: "sarah_design",
    email: "sarah@example.com",
    password: "password123",
    name: "Sarah Chen",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
    bio: "UI/UX Designer at a modern fintech startup. Obsessed with clean typography and glassmorphic micro-interactions."
  }
];

const SEED_POSTS = [
  {
    id: "post_1",
    title: "The Future of Web Development: Embracing React 19",
    excerpt: "React 19 introduces game-changing features like actions, asset loading, and the new compiler. Here is how they will change the way we build interfaces.",
    content: `Web development is evolving at an unprecedented pace. With the release of React 19, the ecosystem is taking a massive leap forward. Instead of managing complex loading states, pending transitions, and manual DOM updates, React 19 streamlines these patterns into intuitive, native features.

### 1. React Server Actions

One of the most exciting additions is **Actions**. Historically, submitting forms required writing custom event handlers, manually triggering loading spinners, and checking error boundaries. With Server Actions, you can pass async functions directly to HTML form actions:

\`\`\`jsx
async function updateProfile(formData) {
  'use server';
  const name = formData.get("name");
  await db.updateName(name);
}

<form action={updateProfile}>
  <input name="name" />
  <button type="submit">Update</button>
</form>
\`\`\`

React automatically handles the loading state, pending UI states, error resets, and sequential updates.

### 2. The React Compiler

Say goodbye to manual memoization. The new React Compiler automatically memoizes components, props, and dependency arrays. You no longer need to sprinkle \`useMemo\` and \`useCallback\` everywhere just to optimize render performance. The compiler analyzes your code and ensures elements only re-render when they absolutely need to.

### 3. The 'use' Hook

React 19 introduces a brand-new API called \`use\`. It allows you to read promises or context dynamically inside your render method, even conditionally:

\`\`\`jsx
import { use } from 'react';

function WeatherWidget({ weatherPromise }) {
  const weather = use(weatherPromise);
  return <p>Current Temperature: {weather.temp}°C</p>;
}
\`\`\`

Combined with \`<Suspense>\`, it provides a cleaner model for data fetching and asynchronous UI states.

### Summary

React 19 represents a shift towards declarative, developer-friendly paradigms. By removing optimization boilerplate and native form handling struggles, developers can focus on what matters most: building beautiful, responsive user experiences.`,
    category: "Technology",
    authorId: "user_1",
    authorName: "Alex Rivera",
    authorAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
    coverImage: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1000&q=80",
    createdAt: "2026-06-01T10:30:00.000Z",
    updatedAt: "2026-06-01T10:30:00.000Z",
    likes: 42,
    readTime: "4 min read"
  },
  {
    id: "post_2",
    title: "A Designer's Guide to Typography: Crafting Readable Digital Interfaces",
    excerpt: "Typography is the foundation of digital design. Learn how to structure hierarchies, choose responsive line heights, and design visually balanced layouts.",
    content: `Typography is not merely about choosing beautiful fonts; it is about establishing hierarchy, improving reading comprehension, and styling a visual voice for your product. In digital interfaces, readable typography is the difference between an engaging experience and a frustrating bounce rate.

### Establishing a Clear Visual Hierarchy

Every screen should tell a story. Hierarchy tells the reader where to look first, second, and last.
* **H1 (Headers)**: Set the tone. Use an expressive display face (e.g., *Outfit*, *Playfair Display*, or *Inter Black*). Keep it large and confident.
* **Body Text**: Must prioritize legibility. Use clean geometric or humanist sans-serifs (e.g., *Inter*, *Roboto*, or *System UI*).
* **Metadata & Captions**: Make them smaller and slightly muted (e.g., slate/gray hues) to avoid competing with body text.

### The Math Behind Line Heights

A common mistake is using rigid, pixel-based line heights or sticking to browser defaults. For optimal readability:
1. **Body Text**: Line height should be roughly **1.5 to 1.6 times** the font size. This provides enough breathing room for the eyes to track lines comfortably.
2. **Headings**: As font size increases, decrease the line-height multiplier. An H1 needs a tighter line-height (around **1.1 to 1.25**) so the lines do not feel disconnected.
3. **Line Length**: Keep line lengths restricted to **45 to 75 characters** (roughly 600px - 750px wide). Any wider and it becomes exhausting for the eyes to scan back to the next line.

### High-Fidelity Details: Glassmorphic Cards and Text

When designing with translucent backdrops (glassmorphism), typography needs special care. Contrast is easily lost. Use high-contrast headers, drop-shadows on cards to create separation, and semi-transparent white/gray text overlays ONLY when font weights are heavy enough to support legibility.

A beautiful interface starts with beautiful type. Keep your systems simple, maintain consistent scale ratios, and prioritize reading ease over decoration.`,
    category: "Design",
    authorId: "user_2",
    authorName: "Sarah Chen",
    authorAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
    coverImage: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=1000&q=80",
    createdAt: "2026-06-03T14:15:00.000Z",
    updatedAt: "2026-06-03T14:15:00.000Z",
    likes: 58,
    readTime: "3 min read"
  },
  {
    id: "post_3",
    title: "Double Your Output: 5 Minimalist Productivity Frameworks",
    excerpt: "Over-engineered systems cause friction. Explore five clean, minimalist productivity habits that keep you focused on deep work without the clutter.",
    content: `Most productivity tools fail because they introduce friction. When you spend more time color-coding tags, setting deadlines, and organizing kanban boards than actually executing, your system is a distraction. 

Minimalist productivity is about stripping away the noise and focusing on pure execution. Here are five minimalist frameworks that actually work.

### 1. The Ivy Lee Method

This 100-year-old routine is beautifully simple:
1. At the end of each work day, write down the **6 most important tasks** you need to accomplish tomorrow. Do not write more than 6.
2. Order them in terms of absolute importance.
3. Tomorrow, focus solely on the first task. Do not move to task two until task one is completely finished.
4. If anything remains unfinished, move it to the list for the next day.

### 2. Timeboxing (The Single-Tasking Rule)

Multitasking is a myth; it is actually rapid context switching, which drains cognitive energy. Set a calendar block for a specific task—for example, "Write newsletter from 9:00 AM to 10:30 AM"—and disable all notifications. If the timebox expires, stop, evaluate, and schedule the next block.

### 3. The 2-Minute Rule

If a task takes less than two minutes to complete (like responding to a quick email, filing a document, or cleaning your desk), do it **immediately**. Do not schedule it, do not write it on a checklist, do not think about it. Just get it done.

### 4. Zero-Task Days

Dedicate one day a week (preferably a weekend day or mid-week focus day) with absolutely zero scheduled tasks, meetings, or checklists. Allow yourself to create, read, or think freely. This resets mental fatigue and prevents burnout.

### Conclusion

A system is only as good as your ability to stick to it. Choose the framework that causes the least mental drag, silence your notifications, and get to work.`,
    category: "Productivity",
    authorId: "user_1",
    authorName: "Alex Rivera",
    authorAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
    coverImage: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&w=1000&q=80",
    createdAt: "2026-06-05T08:00:00.000Z",
    updatedAt: "2026-06-05T08:00:00.000Z",
    likes: 89,
    readTime: "5 min read"
  }
];

const SEED_COMMENTS = [
  {
    id: "comment_1",
    postId: "post_1",
    content: "The React Compiler is going to save us so much time! No more debugging stale dependencies in useCallback.",
    authorId: "user_2",
    authorName: "Sarah Chen",
    authorAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
    createdAt: "2026-06-01T12:00:00.000Z"
  },
  {
    id: "comment_2",
    postId: "post_1",
    content: "Does Server Actions mean we can bypass API routes completely? This sounds powerful but potentially risky if not secured properly.",
    authorId: "user_1",
    authorName: "Alex Rivera",
    authorAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
    createdAt: "2026-06-01T13:45:00.000Z"
  },
  {
    id: "comment_3",
    postId: "post_2",
    content: "Absolutely agree with the line height rules. So many modern sites make body text lines too tight or too wide, which hurts readability.",
    authorId: "user_1",
    authorName: "Alex Rivera",
    authorAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
    createdAt: "2026-06-03T18:30:00.000Z"
  }
];

const initializeDB = () => {
  getStorageItem("users", SEED_USERS);
  getStorageItem("posts", SEED_POSTS);
  getStorageItem("comments", SEED_COMMENTS);
  getStorageItem("activeSession", null);
};

initializeDB();

export const blogApi = {

  async login(usernameOrEmail, password) {
    await delay();
    const users = JSON.parse(localStorage.getItem("users"));
    const user = users.find(u => 
      (u.username === usernameOrEmail || u.email === usernameOrEmail) && 
      u.password === password
    );

    if (!user) {
      throw new Error("Invalid username or password");
    }

    const token = `mock_token_${user.id}_${Date.now()}`;
    const session = { token, user: { id: user.id, username: user.username, email: user.email, name: user.name, avatar: user.avatar, bio: user.bio } };
    setStorageItem("activeSession", session);
    return session;
  },

  async register(username, email, password, name) {
    await delay();
    const users = JSON.parse(localStorage.getItem("users"));

    if (users.some(u => u.username === username)) {
      throw new Error("Username is already taken");
    }

    if (users.some(u => u.email === email)) {
      throw new Error("Email is already registered");
    }

    const newUser = {
      id: `user_${Date.now()}`,
      username,
      email,
      password,
      name,
      avatar: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80`, 
      bio: "New blog platform member."
    };

    users.push(newUser);
    setStorageItem("users", users);

    const token = `mock_token_${newUser.id}_${Date.now()}`;
    const session = { token, user: { id: newUser.id, username: newUser.username, email: newUser.email, name: newUser.name, avatar: newUser.avatar, bio: newUser.bio } };
    setStorageItem("activeSession", session);
    return session;
  },

  async logout() {
    await delay(200);
    setStorageItem("activeSession", null);
    return { success: true };
  },

  async getCurrentUser() {
    await delay(100);
    return getStorageItem("activeSession", null);
  },

  async getPosts(category = "", search = "") {
    await delay();
    let posts = JSON.parse(localStorage.getItem("posts")) || [];

    posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    if (category && category !== "All") {
      posts = posts.filter(p => p.category.toLowerCase() === category.toLowerCase());
    }

    if (search) {
      const q = search.toLowerCase();
      posts = posts.filter(p => 
        p.title.toLowerCase().includes(q) || 
        p.excerpt.toLowerCase().includes(q) || 
        p.content.toLowerCase().includes(q)
      );
    }

    return posts;
  },

  async getPost(id) {
    await delay();
    const posts = JSON.parse(localStorage.getItem("posts")) || [];
    const post = posts.find(p => p.id === id);
    if (!post) {
      throw new Error("Post not found");
    }
    return post;
  },

  async createPost(postData) {
    await delay();
    const session = JSON.parse(localStorage.getItem("activeSession"));
    if (!session) {
      throw new Error("Unauthorized: Please log in to create a post");
    }

    const posts = JSON.parse(localStorage.getItem("posts")) || [];
    const readTimeMins = Math.ceil((postData.content.split(/\s+/).length) / 200);

    const newPost = {
      id: `post_${Date.now()}`,
      title: postData.title,
      excerpt: postData.excerpt || postData.content.slice(0, 150) + "...",
      content: postData.content,
      category: postData.category || "General",
      authorId: session.user.id,
      authorName: session.user.name,
      authorAvatar: session.user.avatar,
      coverImage: postData.coverImage || "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1000&q=80",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      likes: 0,
      readTime: `${readTimeMins} min read`
    };

    posts.unshift(newPost);
    setStorageItem("posts", posts);
    return newPost;
  },

  async updatePost(id, postData) {
    await delay();
    const session = JSON.parse(localStorage.getItem("activeSession"));
    if (!session) {
      throw new Error("Unauthorized: Please log in");
    }

    const posts = JSON.parse(localStorage.getItem("posts")) || [];
    const postIndex = posts.findIndex(p => p.id === id);

    if (postIndex === -1) {
      throw new Error("Post not found");
    }

    if (posts[postIndex].authorId !== session.user.id) {
      throw new Error("Forbidden: You cannot edit other authors' posts");
    }

    const readTimeMins = Math.ceil((postData.content.split(/\s+/).length) / 200);

    const updatedPost = {
      ...posts[postIndex],
      title: postData.title,
      excerpt: postData.excerpt || postData.content.slice(0, 150) + "...",
      content: postData.content,
      category: postData.category || "General",
      coverImage: postData.coverImage || posts[postIndex].coverImage,
      updatedAt: new Date().toISOString(),
      readTime: `${readTimeMins} min read`
    };

    posts[postIndex] = updatedPost;
    setStorageItem("posts", posts);
    return updatedPost;
  },

  async deletePost(id) {
    await delay();
    const session = JSON.parse(localStorage.getItem("activeSession"));
    if (!session) {
      throw new Error("Unauthorized: Please log in");
    }

    let posts = JSON.parse(localStorage.getItem("posts")) || [];
    const post = posts.find(p => p.id === id);

    if (!post) {
      throw new Error("Post not found");
    }

    if (post.authorId !== session.user.id) {
      throw new Error("Forbidden: You cannot delete other authors' posts");
    }

    posts = posts.filter(p => p.id !== id);
    setStorageItem("posts", posts);

    let comments = JSON.parse(localStorage.getItem("comments")) || [];
    comments = comments.filter(c => c.postId !== id);
    setStorageItem("comments", comments);

    return { success: true };
  },

  async likePost(id) {
    await delay(200);
    const posts = JSON.parse(localStorage.getItem("posts")) || [];
    const postIndex = posts.findIndex(p => p.id === id);

    if (postIndex === -1) {
      throw new Error("Post not found");
    }

    posts[postIndex].likes = (posts[postIndex].likes || 0) + 1;
    setStorageItem("posts", posts);
    return posts[postIndex];
  },

  async getComments(postId) {
    await delay(300);
    const comments = JSON.parse(localStorage.getItem("comments")) || [];
    const filtered = comments.filter(c => c.postId === postId);

    filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    return filtered;
  },

  async createComment(postId, content) {
    await delay();
    const session = JSON.parse(localStorage.getItem("activeSession"));
    if (!session) {
      throw new Error("Unauthorized: Please log in to comment");
    }

    const comments = JSON.parse(localStorage.getItem("comments")) || [];
    const newComment = {
      id: `comment_${Date.now()}`,
      postId,
      content,
      authorId: session.user.id,
      authorName: session.user.name,
      authorAvatar: session.user.avatar,
      createdAt: new Date().toISOString()
    };

    comments.push(newComment);
    setStorageItem("comments", comments);
    return newComment;
  },

  async deleteComment(id) {
    await delay();
    const session = JSON.parse(localStorage.getItem("activeSession"));
    if (!session) {
      throw new Error("Unauthorized: Please log in");
    }

    let comments = JSON.parse(localStorage.getItem("comments")) || [];
    const comment = comments.find(c => c.id === id);

    if (!comment) {
      throw new Error("Comment not found");
    }

    const posts = JSON.parse(localStorage.getItem("posts")) || [];
    const post = posts.find(p => p.id === comment.postId);
    const isPostAuthor = post && post.authorId === session.user.id;

    if (comment.authorId !== session.user.id && !isPostAuthor) {
      throw new Error("Forbidden: You cannot delete this comment");
    }

    comments = comments.filter(c => c.id !== id);
    setStorageItem("comments", comments);
    return { success: true };
  }
};
