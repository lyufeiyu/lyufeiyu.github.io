const contentArea = document.getElementById("content-area");
const navLinks = document.querySelectorAll(".nav-links a"); 
const themeBtn = document.getElementById("theme-toggle");

// 1. 主题切换逻辑 (Theme Switcher)
function initTheme() {
    const savedTheme = localStorage.getItem("theme");
    // 默认设置为 light (常规白)
    if (savedTheme) {
        document.documentElement.setAttribute("data-theme", savedTheme);
    } else {
        document.documentElement.setAttribute("data-theme", "light"); 
    }
}

themeBtn.addEventListener("click", () => {
    const currentTheme = document.documentElement.getAttribute("data-theme");
    const newTheme = currentTheme === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
});

initTheme();

// 2. Markdown 渲染工具
function renderMarkdown(mdText) {
    // 确保 MathJax 渲染块级代码中的 TeX 公式
    const html = window.marked ? marked.parse(mdText) : mdText;
    // 简单的图片居中处理，可以根据需要优化
    return html.replace(/<img/g, '<img style="display:block; margin: 1.5rem auto; max-width: 100%;"');
}

async function loadMarkdownFile(url) {
    try {
        const res = await fetch(url);
        if (!res.ok) throw new Error("File not found: " + url);
        const md = await res.text();
        return renderMarkdown(md);
    } catch (e) {
        console.error(e);
        return `<p style="color:red;">内容加载失败。文件 <code>${url}</code> 不存在或加载错误。</p>`;
    }
}

// 3. 页面渲染逻辑
function fadeOutIn(callback) {
    contentArea.style.opacity = '0';
    contentArea.style.transform = 'translateY(10px)';
    contentArea.style.transition = 'opacity 0.3s, transform 0.3s';
    
    setTimeout(async () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        await callback();
        contentArea.style.opacity = '1';
        contentArea.style.transform = 'translateY(0)';
    }, 300);
}

const pages = {
    home: () => fadeOutIn(() => {
        const heroHTML = `
            <section class="hero-layout">
                <div class="hero-text">
                    <h1>FEIYU<br>STUDIO</h1>
                    <div class="hero-intro">
                        <p>Master Candidate at Shenzhen University.</p>
                        <a href="https://csse.szu.edu.cn/pages/user/index?id=760" target="_blank" class="supervisor-link">
                            Supervised by Prof. ZHOU Yu ↗
                        </a>
                        <p style="margin-top:1.5rem">
                            Exploring the boundaries of <strong>Evolutionary Computation</strong> and <strong>LLMs</strong>. 
                            Crafting algorithms with precision and code with passion.
                        </p>
                    </div>
                    <div class="stat-row">
                        <div class="stat-item">
                            <span class="stat-num">02</span>
                            <span class="stat-label">Years Exp</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-num">02</span>
                            <span class="stat-label">Publications</span>
                        </div>
                    </div>
                </div>
                
                <div class="hero-visual">
                    <div class="photo-card">
                        <img src="images/avatar3.jpg" alt="Research Life">
                    </div>
                    <div class="photo-card">
                         <img src="images/avatar2.jpg" alt="University Campus">
                    </div>
                    <div class="photo-card">
                        <img src="images/avatar1.jpg" alt="Portrait">
                    </div>
                </div>
            </section>
        `;

        const postsHTML = renderProjectCards();
        
        contentArea.innerHTML = `
            ${heroHTML}
            <section>
                <div class="section-title">Latest Updates</div>
                <div class="grid-wrapper">
                    ${postsHTML}
                </div>
            </section>
        `;
        bindPostLinks();
    }),

    about: async () => {
        fadeOutIn(async () => {
            const content = await loadMarkdownFile("content/about.md");
            contentArea.innerHTML = `
                <div class="article-container">
                   <!-- <h1 style="font-family:var(--font-display); font-size:3rem; margin-bottom:1rem;">My Past Journey</h1> -->
                   <div class="article-body">${content}</div>
                </div>
            `;
            if (window.MathJax) MathJax.typeset();
        });
    },

    contact: async () => {
        fadeOutIn(async () => {
            const content = await loadMarkdownFile("content/contact.md");
            contentArea.innerHTML = `
                <div class="article-container">
                   <h1 style="font-family:var(--font-display); font-size:3rem; margin-bottom:1rem;">Let's Connect</h1>
                   <div class="article-body">${content}</div>
                </div>
            `;
            if (window.MathJax) MathJax.typeset();
        });
    },

    post: async (postId) => {
        const post = posts.find(p => p.id === postId);
        if (!post) return;
        fadeOutIn(async () => {
            let content = post.contentFile ? await loadMarkdownFile(post.contentFile) : "";
            contentArea.innerHTML = `
                <article class="article-container">
                    <div style="margin-bottom:2rem; text-align:center;">
                        <span style="color:var(--accent-color); font-weight:bold; letter-spacing:2px; text-transform:uppercase;">${post.category}</span>
                        <h1 style="font-family:var(--font-display); font-size:2.5rem; margin:0.5rem 0;">${post.title}</h1>
                        <p style="color:var(--text-secondary);">${post.date}</p>
                    </div>
                    <img src="${post.image}" style="width:100%; border-radius:12px; margin-bottom:2rem;" />
                    <div class="article-body">${content}</div>
                    <div style="margin-top:3rem; padding-top:2rem; border-top:1px solid var(--border-color);">
                        <a href="#home" class="nav-links" style="font-weight:bold;">← Back to Home</a>
                    </div>
                </article>
            `;
            if (window.MathJax) MathJax.typeset();
        });
    }
};

// --- 数据源：用于 Bento Grid ---
const posts = [
    {
        id: "post1",
        title: "Survey on Multi-Objective Optimization",
        date: "2025.04",
        category: "Research",
        layout: "wide", // 宽卡片 (跨 2 列)
        excerpt: "An in-depth analysis of evolutionary algorithms and learning-based optimization.",
        contentFile: "content/post1.md",
        image: "images/MO.jpg"
    },
    {
        id: "post2",
        title: "Undergraduate Memories",
        date: "2025.04",
        category: "Life",
        layout: "wide", // 高卡片 (跨 2 行)
        excerpt: "Stories, photos, and reflections from my four years at university.",
        contentFile: "content/post2.md",
        image: "images/sixP.jpg"
    },
    {
        id: "post3",
        title: "LLM-MTPSO: Large Language Model-Assisted Multi-task Particle Swarm Optimization for Imbalanced Classification",
        date: "2025.03",
        category: "Paper",
        layout: "wide", // 正常大小
        excerpt: "Building a smart framework to assist in imbalanced classification.",
        contentFile: "content/post3.md",
        image: "images/MIND2025.jpg" 
    },
    // {
    //     id: "post4",
    //     title: "City Walk: Discovering Shenzhen's Techscape",
    //     date: "2025.02",
    //     category: "Life",
    //     layout: "normal",
    //     excerpt: "Exploring the tech jungle on a rainy Sunday.",
    //     contentFile: null,
    //     image: "images/robot.jpg"
    // },
    {
        id: "post4",
        title: "An Angular Quantization-Guided Evolutionary Framework for Feature Selection in High-Dimensional Imbalanced Classification",
        date: "2025.11",
        category: "Paper",
        layout: "wide", 
        excerpt: "A work on angular quantization-guided evolutionary framework.",
        contentFile: "content/post4.md",
        image: "images/AQ-NSGA.jpg"
    }
];

// 渲染函数：应用 layout 类名
function renderProjectCards() {
    return posts.map((post) => {
        let gridClass = "";
        if (post.layout === "wide") gridClass = "span-col-2";
        if (post.layout === "tall") gridClass = "span-row-2";
        if (post.layout === "big")  gridClass = "span-col-2 span-row-2";
        
        let styleClass = post.category === "Life" ? "style-life" : "style-tech";

        return `
        <div class="project-card post-link ${gridClass} ${styleClass}" data-id="${post.id}">
            <div class="card-img">
                <img src="${post.image}" alt="${post.title}" loading="lazy">
            </div>
            <div class="card-content">
                <span class="card-tag">${post.category}</span>
                <h3 class="card-title">${post.title}</h3>
                <p class="card-excerpt">${post.excerpt}</p>
                <span class="read-link">Explore</span>
            </div>
        </div>
    `}).join("");
}

// 绑定文章卡片点击事件
function bindPostLinks() {
    document.querySelectorAll(".post-link").forEach(el => {
        el.addEventListener("click", (e) => {
            if(e.target.tagName === 'A') return;
            window.location.hash = `#post-${el.dataset.id}`;
        });
    });
}

// 路由函数
async function router() {
    const hash = window.location.hash.replace('#', '') || 'home';
    navLinks.forEach(l => l.classList.remove("active"));
    
    if (hash.startsWith("post-")) {
        const postId = hash.replace("post-", "");
        await pages.post(postId);
    } else if (pages[hash]) {
        await pages[hash]();
        const activeLink = document.querySelector(`.nav-links a[data-page="${hash}"]`);
        if(activeLink) activeLink.classList.add("active");
    } else {
        await pages.home();
        document.querySelector(`.nav-links a[data-page="home"]`).classList.add("active");
    }
}

// 监听 hash 变化和页面加载完成
window.addEventListener("hashchange", router);
window.addEventListener("load", router);