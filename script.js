const contentArea = document.getElementById("content-area");
const navLinks = document.querySelectorAll(".nav-links a");
const themeBtn = document.getElementById("theme-toggle");
const langBtn = document.getElementById("lang-toggle");

// file:// 预览或严格隐私模式可能禁用 localStorage；禁用时仍保证页面正常渲染。
const storage = {
    get(key) {
        try { return window.localStorage.getItem(key); } catch (error) { return null; }
    },
    set(key, value) {
        try { window.localStorage.setItem(key, value); } catch (error) { /* 使用当前会话状态 */ }
    }
};

let currentLang = storage.get("language") || "en";

const translations = {
    zh: {
        navHome: "主页",
        navProject: "项目",
        navStory: "故事",
        footer: "由 Feiyu 设计。",
        personalHomepage: "个人主页",
        role: "深圳大学 · 计算机科学与技术硕士研究生",
        summary: "研究方向聚焦于 LLM 辅助的元启发式算法、智能体设计与组合神经网络优化。",
        education: "教育背景",
        educationEn: "Education",
        bachelorLabel: "本科",
        bachelor: "深圳大学计算机科学与技术（2020—2024）",
        masterLabel: "硕士",
        master: "深圳大学计算机科学与技术（2024—预计 2027）",
        advisorLabel: "硕士导师",
        advisor: "周宇 教授 ↗",
        research: "科研成果",
        researchEn: "Publications",
        researchHint: "* 通讯作者 · 点击论文查看详情",
        selected: "精选经历",
        selectedEn: "Selected Experience",
        honorsLabel: "竞赛荣誉",
        honorsEn: "Honors & Awards",
        honorsMore: "展开查看其他奖项",
        honorsLess: "收起其他奖项",
        practiceLabel: "实践经历",
        practice: "深圳海关人工智能创新实验室、国家超级计算深圳中心、深圳市中达瑞和科技有限公司",
        skillsLabel: "技术能力",
        skills: "Python、机器学习、数据分析、特征选择、LLM 智能体与提示词工程",
        connect: "联系我",
        connectEn: "Connect",
        email: "邮箱",
        social: "社交主页",
        codeProfiles: "代码主页",
        socialValue: "<span class=\"social-line\">微信：IthoughtIloveyou</span><span class=\"social-line\">抖音 / 小红书：吕飞雨</span>",
        phone: "电话",
        paperDetails: "论文详情",
        authors: "作者",
        venue: "期刊 / 会议",
        status: "状态",
        overview: "内容概述",
        editNote: "此页面已预留完整论文详情结构，具体内容可在后续继续更新。",
        back: "← 返回主页",
        projectTitle: "项目",
        projectSubtitle: "Project",
        projectPending: "正在推进，敬请期待。",
        projectNote: "很快更新。",
        storyTitle: "故事",
        storySubtitle: "Story",
        storyIntro: "研究之外，我也在记录那些让自己持续前进的片段。",
        storyOneYear: "2024",
        storyOneTitle: "从本科走向研究生",
        storyOne: "结束四年的计算机科学与技术本科学习后，我留在深圳大学继续攻读硕士。身份的变化没有让探索停止，反而让我开始更认真地思考：怎样把一个模糊的问题变成值得研究、能够验证的工作。",
        storyTwoYear: "现在",
        storyTwoTitle: "和算法一起迭代",
        storyTwo: "我的日常由论文、实验、代码和许多失败的想法组成。比起一次得到答案，我更享受不断提出问题、修正假设，再让结果慢慢变得清晰的过程。",
        storyNote: "这里暂时放下两段简短记录，后续可以继续加入生活、学习和研究中的故事。",
        viewPaper: "查看论文详情 ↗"
    },
    en: {
        navHome: "Home",
        navProject: "Project",
        navStory: "Story",
        footer: "Designed by Feiyu.",
        personalHomepage: "PERSONAL HOMEPAGE",
        role: "M.Sc. Student in Computer Science and Technology at Shenzhen University",
        summary: "My research focuses on LLM-assisted metaheuristic algorithm design, agent design, and combinatorial neural network optimization.",
        education: "Education",
        educationEn: "Education",
        bachelorLabel: "Bachelor",
        bachelor: "Computer Science and Technology, Shenzhen University (2020—2024)",
        masterLabel: "Master",
        master: "Computer Science and Technology, Shenzhen University (2024—2027, expected)",
        advisorLabel: "Master’s Advisor",
        advisor: "Prof. Yu Zhou ↗",
        research: "Publications",
        researchEn: "Research",
        researchHint: "* Corresponding author · Select a paper for details",
        selected: "Selected Experience",
        selectedEn: "Highlights",
        honorsLabel: "Honors",
        honorsEn: "荣誉奖项",
        honorsMore: "View additional honors",
        honorsLess: "Hide additional honors",
        practiceLabel: "Experience",
        practice: "AI Innovation Lab of Shenzhen Customs, National Supercomputing Center in Shenzhen, and Shenzhen Zhongdaruihe Technology Co., Ltd.",
        skillsLabel: "Skills",
        skills: "Python, machine learning, data analysis, feature selection, LLM agents, and prompt engineering",
        connect: "Connect",
        connectEn: "Contact",
        email: "Email",
        social: "Profiles",
        codeProfiles: "Code Profiles",
        socialValue: "<span class=\"social-line\">WeChat: IthoughtIloveyou</span><span class=\"social-line\">Douyin / Xiaohongshu: Feiyu Lyu</span>",
        phone: "Phone",
        paperDetails: "Paper Details",
        authors: "Authors",
        venue: "Venue",
        status: "Status",
        overview: "Overview",
        editNote: "This page retains the full paper-detail structure and can be expanded with updated content later.",
        back: "← Back to Home",
        projectTitle: "Project",
        projectSubtitle: "项目",
        projectPending: "Work in progress. Stay tuned.",
        projectNote: "Update soon.",
        storyTitle: "Story",
        storySubtitle: "故事",
        storyIntro: "Beyond research, I keep notes on the moments that continue to move me forward.",
        storyOneYear: "2024",
        storyOneTitle: "From Undergraduate to Graduate Study",
        storyOne: "After four years of undergraduate study in Computer Science and Technology, I stayed at Shenzhen University for my master's degree. The new role made me think more carefully about turning a vague question into research that can be tested and understood.",
        storyTwoYear: "Now",
        storyTwoTitle: "Iterating with Algorithms",
        storyTwo: "My days are filled with papers, experiments, code, and ideas that often fail. Instead of expecting an immediate answer, I enjoy asking questions, revising assumptions, and watching the result gradually become clearer.",
        storyNote: "These are temporary notes. More stories about life, study, and research can be added here later.",
        viewPaper: "View paper details ↗"
    }
};

function t(key) {
    return translations[currentLang][key];
}

function initTheme() {
    document.documentElement.setAttribute("data-theme", storage.get("theme") || "light");
}

themeBtn.addEventListener("click", () => {
    const nextTheme = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", nextTheme);
    storage.set("theme", nextTheme);
});

function updateStaticLanguage() {
    document.documentElement.lang = currentLang === "zh" ? "zh-CN" : "en";
    langBtn.textContent = currentLang === "zh" ? "EN" : "中";
    langBtn.setAttribute("aria-label", currentLang === "zh" ? "Switch to English" : "切换为中文");
    document.querySelectorAll("[data-i18n]").forEach(element => {
        element.textContent = t(element.dataset.i18n);
    });
}

langBtn.addEventListener("click", () => {
    currentLang = currentLang === "zh" ? "en" : "zh";
    storage.set("language", currentLang);
    updateStaticLanguage();
    router();
});

initTheme();
updateStaticLanguage();

function renderMarkdown(mdText) {
    const html = window.marked ? marked.parse(mdText) : mdText;
    return html.replace(/<img/g, '<img style="display:block; margin: 1.5rem auto; max-width: 100%;"');
}

async function loadMarkdownFile(url) {
    try {
        const res = await fetch(url);
        if (!res.ok) throw new Error("File not found: " + url);
        return renderMarkdown(await res.text());
    } catch (error) {
        console.error(error);
        return `<p>Content is being updated.</p>`;
    }
}

function fadeOutIn(callback) {
    contentArea.style.opacity = "0";
    contentArea.style.transform = "translateY(10px)";
    contentArea.style.transition = "opacity 0.3s, transform 0.3s";

    setTimeout(async () => {
        try {
            window.scrollTo({ top: 0, behavior: "smooth" });
            await callback();
        } catch (error) {
            console.error("Page render failed:", error);
            contentArea.innerHTML = `<div class="render-error">${currentLang === "zh" ? "页面加载失败，请刷新后重试。" : "The page failed to load. Please refresh and try again."}</div>`;
        } finally {
            contentArea.style.opacity = "1";
            contentArea.style.transform = "translateY(0)";
        }
    }, 120);
}

const papers = [
    {
        id: "fmm-agent",
        year: "2026",
        title: "FMM-Agent: Evolving Feature Meta-Models for Industrial Imbalanced Scenarios via LLMs",
        authors: "Yu Zhou, G. Lyu, H. Guo*, S. Kwong, Q. Zhang",
        venue: "Frontiers of Engineering Management",
        highlights: {
            zh: ["ESCI", "中科院一区 Top", "JCR Q1", "IF 9.8"],
            en: ["ESCI", "CAS Q1 · Top", "JCR Q1", "IF 9.8"]
        },
        status: { zh: "已录用", en: "Accepted for publication" },
        summary: {
            zh: "面向工业不平衡与非平稳数据分布，构建由大语言模型驱动的特征元模型演化框架，以自动搜索有效的特征变换。",
            en: "An LLM-driven feature meta-model evolution framework for automated feature construction under industrial imbalance and non-stationary data distributions."
        }
    },
    {
        id: "emato-lfs",
        year: "2026",
        title: "EMaTO-LFS: Evolutionary Many-Task Optimization-based Localized Feature Selection for High-Dimensional Classification",
        authors: "G. Lyu, Y. Zheng, Yu Zhou*, J. Ji, J. Huang, Z.-H. Zhan, S. Kwong",
        venue: "IEEE Transactions on Cybernetics",
        highlights: {
            zh: ["SCI", "中科院一区 Top", "JCR Q1", "IF 11.3"],
            en: ["SCI", "CAS Q1 · Top", "JCR Q1", "IF 11.3"]
        },
        status: { zh: "已录用", en: "Accepted for publication" },
        summary: {
            zh: "将局部区域建模为多目标特征选择任务，并通过基于任务反馈的自适应知识迁移提升高维分类中的搜索效率。",
            en: "A localized feature-selection framework that models regions as many optimization tasks and improves high-dimensional search through feedback-driven knowledge transfer."
        }
    },
    {
        id: "fuzzy-lfs",
        year: "2026",
        title: "Fuzzy-LFS: A Novel Localized Feature Selection with Fuzzy Region Division and Local Neighborhood Rough Set for Classification",
        authors: "J. Huang, Yu Zhou*, M. Jia, G. Lyu, Q. Zhang, S. Kwong",
        venue: "IEEE Transactions on Fuzzy Systems, 34(6), 1844–1858",
        highlights: {
            zh: ["SCI", "中科院一区 Top", "JCR Q1", "IF 10.2"],
            en: ["SCI", "CAS Q1 · Top", "JCR Q1", "IF 10.2"]
        },
        status: { zh: "已发表", en: "Published" },
        doi: "https://doi.org/10.1109/TFUZZ.2026.3679190",
        summary: {
            zh: "利用高斯模糊隶属度划分局部区域，并结合局部邻域粗糙集与前向贪心优化完成分类特征选择。",
            en: "A localized feature-selection method combining Gaussian fuzzy region division, local neighborhood rough sets, and forward greedy optimization."
        }
    },
    {
        id: "llm-mtpso",
        year: "2025",
        title: "LLM-MTPSO: Large Language Model-Assisted Multi-task Particle Swarm Optimization for Imbalanced Classification",
        authors: "G. Lv, J. Wang, J. Lin, Yu Zhou*",
        venue: "2025 International Conference on Machine Intelligence and Nature-Inspired Computing (MIND), IEEE, pp. 107–112",
        highlights: {
            zh: ["EI 会议", "IEEE Xplore"],
            en: ["EI Conference", "IEEE Xplore"]
        },
        status: { zh: "已发表", en: "Published" },
        contentFile: "content/post3.md",
        summary: {
            zh: "结合大语言模型的语义推理与多任务粒子群搜索，加强任务间信息共享并改善不平衡分类性能。",
            en: "An LLM-assisted multi-task particle swarm optimizer that enhances cross-task information sharing for imbalanced classification."
        }
    },
    {
        id: "aq-nsga",
        year: "2025",
        title: "An Angular Quantization-Guided Evolutionary Framework for Feature Selection in High-Dimensional Imbalanced Classification",
        authors: "G. Lv, Z. Lin, Y. Zheng, G. Li, Yu Zhou*",
        venue: "The 20th CCF Conference on Computer Supported Cooperative Work and Social Computing",
        highlights: {
            zh: ["EI 会议", "CCF CSCW 2025"],
            en: ["EI Conference", "CCF CSCW 2025"]
        },
        status: { zh: "已录用", en: "Accepted / In press" },
        contentFile: "content/post4.md",
        summary: {
            zh: "以角度量化机制引导种群初始化、子代筛选与环境选择，提高高维不平衡特征选择中的解多样性。",
            en: "An angular quantization-guided evolutionary framework that preserves solution diversity in high-dimensional imbalanced feature selection."
        }
    }
];

const awards = [
    {
        year: "2021",
        level: { zh: "亚太地区", en: "Asia-Pacific" },
        name: {
            zh: "第十一届 APMCM 亚太地区大学生数学建模竞赛三等奖",
            en: "Third Prize, 11th APMCM Asia-Pacific Mathematical Modeling Competition"
        },
        featured: true
    },
    {
        year: "2023",
        level: { zh: "国家级", en: "National" },
        name: {
            zh: "第十四届蓝桥杯全国总决赛 Python 程序设计大学组全国三等奖",
            en: "National Third Prize, 14th Lanqiao Cup National Finals, Python Programming (University Group)"
        },
        featured: true
    },
    {
        year: "2023",
        level: { zh: "国家级", en: "National" },
        name: {
            zh: "2022—2023 年度全国大学生算法设计与编程挑战赛（秋季赛）优秀奖",
            en: "Excellence Award, 2022–2023 National College Student Algorithm Design and Programming Challenge (Autumn)"
        },
        featured: true
    },
    {
        year: "2021",
        level: { zh: "省级", en: "Provincial" },
        name: {
            zh: "第七届中国国际“互联网+”大学生创新创业大赛产业命题赛道广东省铜奖（团队排名第 1；负责项目并进行welink小程序开发）",
            en: "Guangdong Bronze Award, 7th China International College Students’ Internet+ Competition, Industry Track (Team Rank 1; led the project and contributed to Welink Mini Program development)"
        },
        featured: true
    },
    {
        year: "2025",
        level: { zh: "国家级", en: "National" },
        name: {
            zh: "中国国际大学生创新大赛（2025）国赛银奖——《光显癌踪：高精度智能显微病理诊断系统领航者》",
            en: "National Silver Award, China International College Students’ Innovation Competition (2025) — “Illuminating Cancer Traces: A High-Precision Intelligent Microscopic Pathology Diagnosis System”"
        }
    },
    {
        year: "2022",
        level: { zh: "省级", en: "Provincial" },
        name: {
            zh: "第八届中国国际“互联网+”大学生创新创业大赛高教主赛道广东省银奖",
            en: "Guangdong Silver Award, 8th China International College Students’ Internet+ Innovation and Entrepreneurship Competition"
        }
    },
    {
        year: "2023",
        level: { zh: "省级", en: "Provincial" },
        name: {
            zh: "第十四届蓝桥杯广东赛区 Python 程序设计大学组一等奖",
            en: "Guangdong First Prize, 14th Lanqiao Cup, Python Programming (University Group)"
        }
    },
    {
        year: "2023",
        level: { zh: "全国赛事", en: "National Competition" },
        name: {
            zh: "华为软件精英挑战赛全国 TOP150",
            en: "National TOP 150, Huawei Software Elite Challenge"
        }
    },
    {
        year: "2022",
        level: { zh: "企业荣誉", en: "Industry Honor" },
        name: { zh: "腾讯益友奖", en: "Tencent Friend Award" }
    },
    {
        year: "2022",
        level: { zh: "国际赛事", en: "International" },
        name: { zh: "欧莱雅商业竞赛优秀奖", en: "Excellence Award, L’Oréal Business Competition" }
    },
    {
        year: "2021",
        level: { zh: "企业荣誉", en: "Industry Honor" },
        name: { zh: "教育部—华为“智能基座”未来之星", en: "Future Star, Ministry of Education–Huawei Intelligent Base" }
    },
    {
        year: "2021—2022",
        level: { zh: "校级", en: "University" },
        name: { zh: "高性能计算特色班学业奖学金", en: "Academic Scholarship, High-Performance Computing Special Class" }
    },
    {
        year: "2021—2022",
        level: { zh: "校级", en: "University" },
        name: { zh: "创新创业之星一等奖", en: "First Prize, Innovation and Entrepreneurship Star" }
    },
    {
        year: "2022—2023",
        level: { zh: "校级", en: "University" },
        name: { zh: "创新创业之星二等奖", en: "Second Prize, Innovation and Entrepreneurship Star" }
    },
    {
        year: "2020—2021",
        level: { zh: "校级", en: "University" },
        name: { zh: "创新创业之星二等奖", en: "Second Prize, Innovation and Entrepreneurship Star" }
    },
    {
        year: "2021—2022",
        level: { zh: "校级", en: "University" },
        name: { zh: "优秀学生干部二等奖", en: "Second Prize, Outstanding Student Leader" }
    },
    {
        year: "2020—2021",
        level: { zh: "校级", en: "University" },
        name: { zh: "电信学院“挑战杯”三等奖（排名第 3）", en: "Third Prize, Telecommunications Institute Challenge Cup (Rank 3)" }
    }
];

function renderAwardRows(items) {
    return items.map(award => `
        <div class="award-row">
            <span class="award-year">${award.year}</span>
            <span class="award-level">${award.level[currentLang]}</span>
            <p>${award.name[currentLang]}</p>
        </div>
    `).join("");
}

function renderPaperHighlights(paper) {
    if (!paper.highlights) return "";
    return `<span class="paper-venue-title">(${paper.highlights[currentLang].join(" · ")})</span>`;
}

function renderPaperAuthors(authors) {
    return authors.replace(/G\. (Lyu|Lv)/g, '<span class="paper-self">G. $1</span>');
}

function renderAwards() {
    const featured = awards.filter(award => award.featured);
    const additional = awards.filter(award => !award.featured);
    return `
        <div class="awards-list">${renderAwardRows(featured)}</div>
        <details class="awards-more">
            <summary><span class="summary-open">${t("honorsMore")}</span><span class="summary-close">${t("honorsLess")}</span><span aria-hidden="true">＋</span></summary>
            <div class="awards-list awards-secondary">${renderAwardRows(additional)}</div>
        </details>
    `;
}

function renderResearchRows() {
    return papers.map((paper, index) => `
        <article class="paper-row post-link" data-id="${paper.id}" tabindex="0" role="link">
            <span class="paper-index">${String(index + 1).padStart(2, "0")}</span>
            <div class="paper-main">
                <h3>${paper.title}</h3>
                <p class="paper-authors">${renderPaperAuthors(paper.authors)}</p>
                <p class="paper-meta"><span class="paper-venue">${paper.venue}</span> ${renderPaperHighlights(paper)}<span class="paper-status">· ${paper.status[currentLang]}</span></p>
            </div>
            <span class="paper-year">${paper.year}</span>
        </article>
    `).join("");
}

const pages = {
    home: () => fadeOutIn(() => {
        contentArea.innerHTML = `
            <div class="profile-page">
                <section class="profile-header">
                    <div class="profile-heading">
                        <p class="profile-kicker">${t("personalHomepage")}</p>
                        <h1>${currentLang === "zh" ? "吕广华" : "Guanghua Lyu"}</h1>
                        <p class="profile-role">${t("role")}</p>
                        <p class="profile-summary">${t("summary")}</p>
                    </div>
                    <figure class="profile-photo"><img src="images/avatar2.jpg" alt="Guanghua Lyu"></figure>
                </section>

                <section class="profile-section">
                    <h2>${t("education")} <span>${t("educationEn")}</span></h2>
                    <div class="info-list compact-list">
                        <div class="info-row"><span>${t("bachelorLabel")}</span><p>${t("bachelor")}</p></div>
                        <div class="info-row"><span>${t("masterLabel")}</span><p>${t("master")}</p></div>
                        <div class="info-row"><span>${t("advisorLabel")}</span><p><a href="https://csse.szu.edu.cn/pages/user/index?id=760" target="_blank" rel="noopener">${t("advisor")}</a></p></div>
                    </div>
                </section>

                <section class="profile-section research-section">
                    <h2>${t("research")} <span>${t("researchEn")}</span></h2>
                    <p class="section-caption">${t("researchHint")}</p>
                    <div class="paper-list">${renderResearchRows()}</div>
                </section>

                <section class="profile-section honors-section">
                    <h2>${t("honorsLabel")} <span>${t("honorsEn")}</span></h2>
                    ${renderAwards()}
                </section>

                <section class="profile-section">
                    <h2>${t("selected")} <span>${t("selectedEn")}</span></h2>
                    <div class="info-list compact-list">
                        <div class="info-row"><span>${t("practiceLabel")}</span><p>${t("practice")}</p></div>
                        <div class="info-row"><span>${t("skillsLabel")}</span><p>${t("skills")}</p></div>
                    </div>
                </section>

                <section class="profile-section connect-section">
                    <h2>${t("connect")} <span>${t("connectEn")}</span></h2>
                    <div class="connect-grid">
                        <a href="mailto:2400101051@mails.szu.edu.cn"><span>${t("email")}</span>2400101051@mails.szu.edu.cn</a>
                        <div class="connect-item"><span>${t("codeProfiles")}</span><a href="https://github.com/lyufeiyu" target="_blank" rel="noopener">GitHub ↗</a> · <a href="https://gitee.com/lvfeiyu0421" target="_blank" rel="noopener">Gitee ↗</a></div>
                        <div class="connect-item"><span>${t("social")}</span>${t("socialValue")}</div>
                    </div>
                </section>
            </div>`;
        bindPostLinks();
    }),

    project: () => fadeOutIn(() => {
        contentArea.innerHTML = `
            <section class="placeholder-page">
                <p class="profile-kicker">${t("projectSubtitle")}</p>
                <h1>${t("projectTitle")}</h1>
                <p class="placeholder-lead">${t("projectPending")}</p>
                <p>${t("projectNote")}</p>
                <a href="#home" class="section-more">${t("back")}</a>
            </section>`;
    }),

    story: () => fadeOutIn(() => {
        contentArea.innerHTML = `
            <article class="story-page">
                <header class="story-header">
                    <p class="profile-kicker">${t("storySubtitle")}</p>
                    <h1>${t("storyTitle")}</h1>
                    <p>${t("storyIntro")}</p>
                </header>
                <section class="story-entry">
                    <span>${t("storyOneYear")}</span>
                    <div><h2>${t("storyOneTitle")}</h2><p>${t("storyOne")}</p></div>
                </section>
                <section class="story-entry">
                    <span>${t("storyTwoYear")}</span>
                    <div><h2>${t("storyTwoTitle")}</h2><p>${t("storyTwo")}</p></div>
                </section>
                <p class="story-note">${t("storyNote")}</p>
            </article>`;
    }),

    // 兼容旧链接，保留原有 hash 跳转能力。
    about: () => pages.project(),

    contact: async () => fadeOutIn(async () => {
        const content = await loadMarkdownFile("content/contact.md");
        contentArea.innerHTML = `<div class="article-container"><h1>${t("connect")}</h1><div class="article-body">${content}</div></div>`;
    }),

    post: paperId => {
        const paper = papers.find(item => item.id === paperId);
        if (!paper) return pages.home();
        fadeOutIn(() => {
            contentArea.innerHTML = `
                <article class="paper-detail article-container">
                    <p class="profile-kicker">${t("paperDetails")} · ${paper.year}</p>
                    <h1>${paper.title}</h1>
                    <dl class="paper-facts">
                        <div><dt>${t("authors")}</dt><dd>${renderPaperAuthors(paper.authors)}</dd></div>
                        <div><dt>${t("venue")}</dt><dd>${paper.venue} ${renderPaperHighlights(paper)}</dd></div>
                        <div><dt>${t("status")}</dt><dd>${paper.status[currentLang]}${paper.doi ? ` · <a href="${paper.doi}" target="_blank" rel="noopener">DOI ↗</a>` : ""}</dd></div>
                    </dl>
                    <section class="paper-overview"><h2>${t("overview")}</h2><p>${paper.summary[currentLang]}</p><p class="edit-note">${t("editNote")}</p></section>
                    <a href="#home" class="section-more">${t("back")}</a>
                </article>`;
        });
    }
};

function bindPostLinks() {
    document.querySelectorAll(".post-link").forEach(element => {
        const openPaper = () => { window.location.hash = `#post-${element.dataset.id}`; };
        element.addEventListener("click", openPaper);
        element.addEventListener("keydown", event => {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                openPaper();
            }
        });
    });
}

async function router() {
    const hash = window.location.hash.replace("#", "") || "home";
    navLinks.forEach(link => link.classList.remove("active"));

    if (hash.startsWith("post-")) {
        await pages.post(hash.replace("post-", ""));
        return;
    }

    const pageName = pages[hash] ? hash : "home";
    await pages[pageName]();
    const activePage = pageName === "about" ? "project" : pageName;
    document.querySelector(`.nav-links a[data-page="${activePage}"]`)?.classList.add("active");
}

window.addEventListener("hashchange", router);
// script 位于 body 末尾，此时 DOM 已可用；立即渲染可兼容普通打开和 IDE 热预览。
router();
