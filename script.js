const contentArea = document.getElementById("content-area");
const navLinks = document.querySelectorAll(".nav-links a");
const themeBtn = document.getElementById("theme-toggle");
const langBtn = document.getElementById("lang-toggle");
const visitorCount = document.getElementById("visitor-count");

// file:// 预览或严格隐私模式可能禁用 localStorage；禁用时仍保证页面正常渲染。
const storage = {
    get(key) {
        try { return window.localStorage.getItem(key); } catch (error) { return null; }
    },
    set(key, value) {
        try { window.localStorage.setItem(key, value); } catch (error) { /* 使用当前会话状态 */ }
    }
};

const languageKey = "language-v2";
let currentLang = storage.get(languageKey) || "en";
let latestVisitorCount = null;
let visitorDisplayState = "loading";

const translations = {
    zh: {
        navHome: "主页",
        navProject: "项目",
        navStory: "故事",
        footer: "更新于 2026/08。",
        visitors: "访客数",
        visitorCounting: "—",
        visitorUnavailable: "暂不可用",
        visitorCached: "暂时显示最近一次结果",
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
        academicProfile: "学术主页",
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
        projectIntro: "把研究想法做成可以运行、验证，也能继续迭代的系统。这里记录两个仍在生长的项目。",
        personalProject: "个人项目",
        labProject: "课题组项目 · 校企合作",
        projectActive: "持续开发",
        projectPilot: "原型验证",
        scholarOsTimeline: "（持续迭代更新）",
        schedulingTimeline: "（2026 年 6 月—12 月，预计）",
        scholarOsZoom: "放大查看",
        scholarOsClose: "关闭图片预览",
        scholarOsLightbox: "ScholarOS 项目图片预览",
        scholarOsLead: "可追溯的研究 Agent 工作区，让研究过程留下可核验的证据链。",
        scholarOsBody: "ScholarOS 将问题界定、检索计划、跨源搜索、证据账本、方法设计、草稿生成、审查和修订建模为七个可恢复阶段。它不只是调用模型，而是把研究协作拆成可检查、可重跑、可追溯的状态与工件，让研究者能在任意节点接管判断。",
        scholarOsTags: "研究 Agent · 证据账本 · 可恢复工作流 · 人机协同闭环",
        scholarOsArchitecture: "架构与运行方式",
        scholarOsInterfaceTitle: "研究交互层",
        scholarOsInterfaceBody: "终端 CLI、交互式工作台、Web 界面与 API 共用同一套项目工作流，而不是各自维护一套孤立的功能。",
        scholarOsWorkflowTitle: "可恢复编排层",
        scholarOsWorkflowBody: "以状态机推进 Question → Scope → Search → Evidence → Design → Draft → Review → Revision。每一步都能查看、重跑或在必要时回退。",
        scholarOsAgentTitle: "Agent 与工具层",
        scholarOsAgentBody: "Agent Loop 统一管理消息、工具调用与事件。模型采用 OpenAI 兼容接口，研究任务不被绑定在单一供应商或单次对话中。",
        scholarOsEvidenceTitle: "检索与证据层",
        scholarOsEvidenceBody: "并行连接 arXiv、OpenAlex、Crossref、Semantic Scholar、DBLP、ACM 与可选 IEEE 等来源，完成去重、严格匹配与来源边界记录。",
        scholarOsStateTitle: "状态与质量层",
        scholarOsStateBody: "SQLite 与 artifact 目录保存项目状态、搜索溯源和草稿。九项确定性检查覆盖引文、方法要素、图表计划、结果来源与研究者责任声明。",
        scholarOsScreens: "产品界面",
        scholarOsScreenWorkspace: "研究工作台总览",
        scholarOsScreenWorkflow: "七阶段项目工作流",
        scholarOsScreenSearch: "跨来源论文检索",
        scholarOsScreenTerminal: "终端研究工作台",
        scholarOsScreenWeb: "本地 Web 服务",
        schedulingTitle: "基于 AI 的自动化排产与智能优化",
        schedulingLead: "把半导体封装制造的多表现场数据，转化为可审计、可接管的排产决策。",
        schedulingBody: "项目以订单、制造单和批次为追踪主线，关联承诺交期、产品与芯片属性、WIP 所在工站、批次下一工序、工艺路线和设备实时能力。目标不是给出一个黑箱排程，而是让每一次分配都有数据依据、约束解释和人工复核入口。",
        schedulingDataTitle: "数据底座：订单到设备的一致视图",
        schedulingDataBody: "基于 RTD Dataset 的 12 张关联表，治理订单、制造单、产品、工艺路线—设备映射、WIP、批次流转与优先级数据。同时纳入设备 UPH、生产/空闲/故障状态、芯片尺寸与双芯能力限制、不可用与维修时段。",
        schedulingOptimizationTitle: "求解策略：约束先行，学习增强",
        schedulingOptimizationBody: "先以工序前后关系、工站与设备兼容性、设备能力、状态、产能和时间窗等硬约束构造可行域，再以交期、优先级、负荷均衡与切换成本组织目标。启发式规则生成高质量可行示例，轻量模型学习设备排序。最终仍由约束引擎校验、修复并拒绝不可行方案。",
        schedulingDeliveryTitle: "产品闭环：结果可读，也可追责",
        schedulingDeliveryBody: "交付面向计划员的排程表、设备负荷与交期指标、甘特图，以及未排批次的具体原因（如设备故障、能力不匹配、维修窗口或前序未完成）。计划员可以锁定订单、调整优先级并重新计算，使系统成为协作式决策工具而非一次性“自动排程”。",
        schedulingTags: "制造数据治理 · 约束排程 · 学习排序 · 人机协同决策",
        storyTitle: "故事",
        storySubtitle: "AI Notes",
        storyIntro: "关于 Agent 如何获得经验，以及它可能走向哪里的一些持续观察。",
        storyOneYear: "上下文",
        storyOneTitle: "记得更多，不等于学会了",
        storyOne: "人很少逐字保存过去。一次失误、一段合作、一个反复出现的模式，最后会被压缩成判断：什么值得注意，什么时候该停，哪些路已经走不通。今天的 Agent 更直接，它的“经验”常常只是更长的上下文、检索回来的片段和一串执行日志。窗口变长，视野确实更大。但如果没有筛选、反思与归纳，它只是带着更多材料重新开始。",
        storyTwoYear: "记忆",
        storyTwoTitle: "经验不是聊天记录的堆积",
        storyTwo: "真正有用的记忆需要经历写入、整理和调用：事实应该能更新，失败要留下原因，成功的方法要能跨任务复用，也要知道何时遗忘。最近的 Agent 研究正在从“保存轨迹”走向“抽象经验”。这一步很关键，因为可靠的长期协作靠的不是无穷回放，而是在合适的时刻想起合适的事。",
        storyThreeYear: "行动",
        storyThreeTitle: "从回答问题，到承担一段过程",
        storyThree: "未来的 Agent 更像持续工作的系统：理解目标，调用工具，观察结果，修正行动，并留下可核查的记录。梁文锋谈创新时提到，经验能提高短期效率，也可能让人不假思索地沿用旧答案。Agent 也一样——它需要探索空间，但探索不能脱离边界、验证和责任。真正的进步，不是让模型显得更像人，而是让它在长期行动中变得更可靠。",
        viewPaper: "查看论文详情 ↗"
    },
    en: {
        navHome: "Home",
        navProject: "Project",
        navStory: "Story",
        footer: "Updated in 2026/08.",
        visitors: "Visitors",
        visitorCounting: "—",
        visitorUnavailable: "Unavailable",
        visitorCached: "Showing the most recent result",
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
        academicProfile: "Academic Profile",
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
        projectIntro: "Turning research ideas into systems that can run, be tested, and keep evolving. These are two projects still in motion.",
        personalProject: "Personal Project",
        labProject: "Lab Project · University–Industry Collaboration",
        projectActive: "Active development",
        projectPilot: "Prototype validated",
        scholarOsTimeline: "(under active iteration)",
        schedulingTimeline: "(Jun–Dec 2026, expected)",
        scholarOsZoom: "View full size",
        scholarOsClose: "Close image preview",
        scholarOsLightbox: "ScholarOS project image preview",
        scholarOsLead: "A traceable research-agent workspace that leaves a verifiable evidence chain behind.",
        scholarOsBody: "ScholarOS models question framing, search planning, cross-source discovery, evidence, method design, drafting, review, and revision as seven recoverable stages. Rather than simply calling a model, it turns research collaboration into inspectable, rerunnable states and artifacts so the researcher can take over at any point.",
        scholarOsTags: "Research agents · Evidence ledger · Recoverable workflows · Human in the loop",
        scholarOsArchitecture: "Architecture and operation",
        scholarOsInterfaceTitle: "Research interface layer",
        scholarOsInterfaceBody: "The terminal CLI, interactive workspace, web interface, and API share one project workflow instead of maintaining isolated feature paths.",
        scholarOsWorkflowTitle: "Recoverable orchestration",
        scholarOsWorkflowBody: "A state machine advances Question → Scope → Search → Evidence → Design → Draft → Review → Revision. Every stage can be inspected, rerun, or revisited when needed.",
        scholarOsAgentTitle: "Agent and tool layer",
        scholarOsAgentBody: "The Agent Loop coordinates messages, tool calls, and events. OpenAI-compatible model interfaces keep research work from being tied to a single provider or one-off conversation.",
        scholarOsEvidenceTitle: "Search and evidence layer",
        scholarOsEvidenceBody: "Parallel adapters connect arXiv, OpenAlex, Crossref, Semantic Scholar, DBLP, ACM, and optional IEEE sources, with deduplication, strict matching, and source-boundary records.",
        scholarOsStateTitle: "State and quality layer",
        scholarOsStateBody: "SQLite and artifact storage retain project state, search provenance, and drafts. Nine deterministic checks cover citations, method elements, figure/table plans, result provenance, and researcher responsibility.",
        scholarOsScreens: "Product screens",
        scholarOsScreenWorkspace: "Research workspace overview",
        scholarOsScreenWorkflow: "Seven-stage project workflow",
        scholarOsScreenSearch: "Cross-source paper search",
        scholarOsScreenTerminal: "Terminal research workspace",
        scholarOsScreenWeb: "Local web service",
        schedulingTitle: "AI-powered Automated Scheduling and Intelligent Optimization",
        schedulingLead: "Turning multi-table shop-floor data for semiconductor packaging into auditable, planner-steerable scheduling decisions.",
        schedulingBody: "Orders, manufacturing orders, and lots form the traceability spine. The system joins promised dates, product and chip attributes, WIP stations, next operations, routes, and real-time machine capability. The aim is not a black-box schedule: every assignment needs a data basis, a constraint explanation, and a point for human review.",
        schedulingDataTitle: "Data foundation: one consistent view from order to machine",
        schedulingDataBody: "The 12 linked tables in the RTD Dataset reconcile orders, manufacturing orders, products, route-to-machine mappings, WIP, lot transfers, and priorities. They also capture machine UPH, production/idle/fault states, chip-size and dual-chip restrictions, plus downtime and maintenance windows.",
        schedulingOptimizationTitle: "Solving strategy: constraints first, learning second",
        schedulingOptimizationBody: "Precedence, station-machine compatibility, machine capability, operating state, capacity, and time windows first define the feasible space. Objectives then organize due dates, priority, load balance, and changeover cost. Heuristics generate strong feasible examples, a lightweight model learns machine rankings, and the constraint engine validates, repairs, or rejects every infeasible proposal.",
        schedulingDeliveryTitle: "Product loop: readable results with accountability",
        schedulingDeliveryBody: "Planners receive schedules, machine-load and due-date metrics, Gantt views, and specific reasons for every unscheduled lot—such as faults, capability conflicts, maintenance windows, or unfinished predecessors. They can lock orders, adjust priorities, and rerun the plan, making the system a collaborative decision tool rather than a one-shot auto-scheduler.",
        schedulingTags: "Manufacturing data governance · Constrained scheduling · Learned ranking · Human-in-the-loop decisions",
        storyTitle: "Story",
        storySubtitle: "AI Notes",
        storyIntro: "Ongoing notes on how agents acquire experience—and where that may lead.",
        storyOneYear: "Context",
        storyOneTitle: "Remembering more is not the same as learning",
        storyOne: "People rarely preserve the past word for word. A mistake, a collaboration, or a recurring pattern is compressed into judgment: what deserves attention, when to stop, and which path has already failed. Agents today are more literal. Their “experience” is often a longer context window, retrieved fragments, and execution logs. A larger window expands what they can see. Without selection, reflection, and abstraction, it still means starting over with a bigger pile of material.",
        storyTwoYear: "Memory",
        storyTwoTitle: "Experience is not a stack of transcripts",
        storyTwo: "Useful memory needs a write, organize, and recall cycle. Facts must be revised, failures should retain their causes, successful methods should transfer across tasks, and some details should be allowed to fade. Agent research is moving from storing trajectories toward abstracting experience. That shift matters because long-term collaboration depends less on replaying everything than on recalling the right thing at the right moment.",
        storyThreeYear: "Action",
        storyThreeTitle: "From answering a question to owning a process",
        storyThree: "Future agents will look less like larger chat boxes and more like persistent systems: interpreting intent, using tools, observing outcomes, correcting actions, and leaving an auditable trail. Liang Wenfeng has noted that experience can improve short-term efficiency while also making old answers feel automatic. The same tension applies to agents. They need room to explore, but exploration still needs boundaries, verification, and accountability. Progress is not about making a model seem more human. It is about making long-running action more dependable.",
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
    storage.set(languageKey, currentLang);
    updateStaticLanguage();
    renderVisitorState();
    router();
});

initTheme();
updateStaticLanguage();

function renderVisitorState() {
    visitorCount.removeAttribute("title");

    if (Number.isFinite(latestVisitorCount) && visitorDisplayState !== "unavailable") {
        const formattedCount = latestVisitorCount.toLocaleString(currentLang === "zh" ? "zh-CN" : "en-US");
        visitorCount.textContent = visitorDisplayState === "cached" ? `≈${formattedCount}` : formattedCount;
        if (visitorDisplayState === "cached") visitorCount.setAttribute("title", t("visitorCached"));
        return;
    }

    visitorCount.textContent = t(visitorDisplayState === "unavailable" ? "visitorUnavailable" : "visitorCounting");
}

function setVisitorState(state, count = null) {
    visitorDisplayState = state;
    latestVisitorCount = Number.isFinite(count) ? count : null;
    renderVisitorState();
}

// 浏览器首次访问登记一次，后续只读刷新全局总数；远端 unique 再提供一层匿名去重。
// 缓存只用于短时秒开，过期或请求失败时显示明确状态，不让页面无限停在 Counting。
async function initVisitorCounter() {
    const endpoint = "https://counterapi.com/api/lyufeiyu.github.io/view/home";
    const visitorKey = "visitor-counted-v2";
    const countKey = "visitor-count-cache-v2";
    const cacheTtl = 10 * 60 * 1000;
    let cachedCount = NaN;
    let cacheIsFresh = false;

    try {
        const cached = JSON.parse(storage.get(countKey));
        cachedCount = Number(cached.count);
        cacheIsFresh = Number.isFinite(cachedCount)
            && Number.isFinite(cached.updatedAt)
            && Date.now() - cached.updatedAt < cacheTtl;
    } catch (error) {
        // 无缓存或旧格式缓存时直接请求远端。
    }

    if (cacheIsFresh) setVisitorState("cached", cachedCount);
    else setVisitorState("loading");

    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), 4500);
    const isCounted = storage.get(visitorKey) === "true";

    try {
        if (!isCounted) {
            const trackingResponse = await fetch(`${endpoint}?trackOnly=true`, {
                cache: "no-store",
                signal: controller.signal
            });
            if (!trackingResponse.ok) throw new Error(`Visitor tracker returned ${trackingResponse.status}`);
            storage.set(visitorKey, "true");
        }

        const response = await fetch(`${endpoint}?unique=true&readOnly=true`, {
            cache: "no-store",
            signal: controller.signal
        });
        if (!response.ok) throw new Error(`Visitor counter returned ${response.status}`);

        const data = await response.json();
        const count = Number(data.value ?? data.count);
        if (!Number.isFinite(count) || count < 0) throw new Error("Visitor counter returned an invalid value");

        storage.set(countKey, JSON.stringify({ count, updatedAt: Date.now() }));
        setVisitorState("ready", count);
    } catch (error) {
        if (cacheIsFresh) setVisitorState("cached", cachedCount);
        else setVisitorState("unavailable");
        console.warn("Unable to refresh visitor count.", error);
    } finally {
        window.clearTimeout(timeoutId);
    }
}

initVisitorCounter();

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
        status: { zh: "已发表", en: "Published" },
        doi: "https://doi.org/10.1007/s42524-026-6014-5",
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
        status: { zh: "已发表", en: "Published" },
        doi: "https://doi.org/10.1109/TCYB.2026.3713350",
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
        doi: "https://doi.org/10.1109/MIND67540.2025.11351785",
        contentFile: "content/post3.md",
        summary: {
            zh: "结合大语言模型的语义推理与多任务粒子群搜索，加强任务间信息共享并改善不平衡分类性能。",
            en: "An LLM-assisted multi-task particle swarm optimizer that enhances cross-task information sharing for imbalanced classification."
        }
    },
    {
        id: "aq-nsga",
        year: "2026",
        title: "An Angular Quantization-Guided Evolutionary Framework for Feature Selection in High-Dimensional Imbalanced Classification",
        authors: "G. Lv, Z. Lin, Y. Zheng, G. Li, Yu Zhou*",
        venue: "Computer Supported Cooperative Work and Social Computing, CCIS 2911, Springer, pp. 85–100",
        highlights: {
            zh: ["EI 会议", "CCF CSCW 2025"],
            en: ["EI Conference", "CCF CSCW 2025"]
        },
        status: { zh: "已发表", en: "Published" },
        doi: "https://doi.org/10.1007/978-981-92-0288-1_7",
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
            zh: "第七届中国国际“互联网+”大学生创新创业大赛产业命题赛道广东省铜奖（团队排名第 1，负责项目并进行 welink 小程序开发）",
            en: "Guangdong Bronze Award, 7th China International College Students’ Internet+ Competition, Industry Track (Team Rank 1, led the project and contributed to Welink Mini Program development)"
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

function renderContactGrid() {
    return `
        <div class="connect-grid">
            <a href="mailto:2400101051@mails.szu.edu.cn"><span>${t("email")}</span>2400101051@mails.szu.edu.cn</a>
            <div class="connect-item"><span>${t("academicProfile")}</span><a href="https://scholar.google.com/citations?user=ZsSOXRAAAAAJ&amp;hl=en" target="_blank" rel="noopener">Google Scholar ↗</a></div>
            <div class="connect-item"><span>${t("codeProfiles")}</span><a href="https://github.com/lyufeiyu" target="_blank" rel="noopener">GitHub ↗</a> · <a href="https://gitee.com/lvfeiyu0421" target="_blank" rel="noopener">Gitee ↗</a></div>
            <div class="connect-item"><span>${t("social")}</span>${t("socialValue")}</div>
        </div>`;
}

function renderScholarOsGallery() {
    const screens = [
        ["research-workspace-overview.jpg", "scholarOsScreenWorkspace"],
        ["research-project-workflow.jpg", "scholarOsScreenWorkflow"],
        ["cross-source-paper-search.jpg", "scholarOsScreenSearch"],
        ["terminal-workspace.jpg", "scholarOsScreenTerminal"],
        ["terminal-web-server.jpg", "scholarOsScreenWeb"]
    ];

    return `
        <section class="project-gallery" aria-label="${t("scholarOsScreens")}">
            <h3>${t("scholarOsScreens")}</h3>
            <div class="project-gallery-grid">
                ${screens.map(([file, caption]) => `
                    <figure>
                        <button class="project-image-trigger" type="button" data-image-src="images/scholaros/${file}" data-image-caption="${t(caption)}" aria-label="${t("scholarOsZoom")}: ${t(caption)}">
                            <img src="images/scholaros/${file}" alt="${t(caption)}" loading="lazy">
                        </button>
                        <figcaption>${t(caption)}</figcaption>
                    </figure>
                `).join("")}
            </div>
            <div class="project-lightbox" hidden role="dialog" aria-modal="true" aria-label="${t("scholarOsLightbox")}" tabindex="-1">
                <button class="project-lightbox-close" type="button" aria-label="${t("scholarOsClose")}">×</button>
                <figure><img src="" alt=""><figcaption></figcaption></figure>
            </div>
        </section>`;
}

function bindProjectImageZoom() {
    const lightbox = contentArea.querySelector(".project-lightbox");
    if (!lightbox) return;

    const image = lightbox.querySelector("img");
    const caption = lightbox.querySelector("figcaption");
    const closeButton = lightbox.querySelector(".project-lightbox-close");
    let lastFocusedElement = null;

    const closeLightbox = () => {
        lightbox.hidden = true;
        image.removeAttribute("src");
        if (lastFocusedElement) lastFocusedElement.focus();
    };

    contentArea.querySelectorAll(".project-image-trigger").forEach(button => {
        button.addEventListener("click", () => {
            lastFocusedElement = button;
            image.src = button.dataset.imageSrc;
            image.alt = button.dataset.imageCaption;
            caption.textContent = button.dataset.imageCaption;
            lightbox.hidden = false;
            lightbox.focus();
        });
    });

    closeButton.addEventListener("click", closeLightbox);
    lightbox.addEventListener("click", event => {
        if (event.target === lightbox) closeLightbox();
    });
    lightbox.addEventListener("keydown", event => {
        if (event.key === "Escape") closeLightbox();
    });
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
                    ${renderContactGrid()}
                </section>
            </div>`;
        bindPostLinks();
    }),

    project: () => fadeOutIn(() => {
        contentArea.innerHTML = `
            <section class="project-page">
                <header class="project-header">
                    <p class="profile-kicker">${t("projectSubtitle")}</p>
                    <p>${t("projectIntro")}</p>
                </header>
                <div class="project-list">
                    <article class="project-entry">
                        <div class="project-meta"><span>01</span><span>${t("personalProject")}</span></div>
                        <div class="project-copy">
                            <div class="project-title-row"><h2><a href="https://github.com/lyufeiyu/scholaros" target="_blank" rel="noopener">ScholarOS ↗</a> <span class="project-title-note">${t("scholarOsTimeline")}</span></h2></div>
                            <p class="project-lead">${t("scholarOsLead")}</p>
                            <p>${t("scholarOsBody")}</p>
                            <p class="project-tags">${t("scholarOsTags")}</p>
                            <section class="project-architecture">
                                <h3>${t("scholarOsArchitecture")}</h3>
                                <div class="project-detail-grid">
                                    <article><span>01</span><h4>${t("scholarOsInterfaceTitle")}</h4><p>${t("scholarOsInterfaceBody")}</p></article>
                                    <article><span>02</span><h4>${t("scholarOsWorkflowTitle")}</h4><p>${t("scholarOsWorkflowBody")}</p></article>
                                    <article><span>03</span><h4>${t("scholarOsAgentTitle")}</h4><p>${t("scholarOsAgentBody")}</p></article>
                                    <article><span>04</span><h4>${t("scholarOsEvidenceTitle")}</h4><p>${t("scholarOsEvidenceBody")}</p></article>
                                    <article><span>05</span><h4>${t("scholarOsStateTitle")}</h4><p>${t("scholarOsStateBody")}</p></article>
                                </div>
                            </section>
                            ${renderScholarOsGallery()}
                        </div>
                    </article>
                    <article class="project-entry">
                        <div class="project-meta"><span>02</span><span>${t("labProject")}</span></div>
                        <div class="project-copy">
                            <div class="project-title-row"><h2>${t("schedulingTitle")} <span class="project-title-note">${t("schedulingTimeline")}</span></h2></div>
                            <p class="project-lead">${t("schedulingLead")}</p>
                            <p>${t("schedulingBody")}</p>
                            <p class="project-tags">${t("schedulingTags")}</p>
                            <div class="project-detail-grid scheduling-detail-grid">
                                <article><span>01</span><h3>${t("schedulingDataTitle")}</h3><p>${t("schedulingDataBody")}</p></article>
                                <article><span>02</span><h3>${t("schedulingOptimizationTitle")}</h3><p>${t("schedulingOptimizationBody")}</p></article>
                                <article><span>03</span><h3>${t("schedulingDeliveryTitle")}</h3><p>${t("schedulingDeliveryBody")}</p></article>
                            </div>
                        </div>
                    </article>
                </div>
            </section>`;
        bindProjectImageZoom();
    }),

    story: () => fadeOutIn(() => {
        contentArea.innerHTML = `
            <article class="story-page">
                <header class="story-header">
                    <p class="profile-kicker">${t("storySubtitle")}</p>
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
                <section class="story-entry">
                    <span>${t("storyThreeYear")}</span>
                    <div><h2>${t("storyThreeTitle")}</h2><p>${t("storyThree")}</p></div>
                </section>
            </article>`;
    }),

    // 兼容旧链接，保留原有 hash 跳转能力。
    about: () => pages.project(),

    contact: () => fadeOutIn(() => {
        contentArea.innerHTML = `<div class="article-container contact-page"><h1>${t("connect")}</h1>${renderContactGrid()}<a href="#home" class="section-more">${t("back")}</a></div>`;
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
