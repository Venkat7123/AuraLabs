// ── AuraLab localStorage helpers ──

const KEYS = {
    USER: 'auralab-user',
    SUBJECTS: 'auralab-subjects',
    STREAKS: 'auralab-streaks',
    CHATS: 'auralab-chats',
    LANG: 'auralab-lang',
};

// ── User ──
export function getUser() {
    if (typeof window === 'undefined') return null;
    const raw = localStorage.getItem(KEYS.USER);
    return raw ? JSON.parse(raw) : null;
}

export function saveUser(user) {
    localStorage.setItem(KEYS.USER, JSON.stringify(user));
}

export function clearUser() {
    localStorage.removeItem(KEYS.USER);
}

// ── Subjects ──
export function getSubjects() {
    if (typeof window === 'undefined') return [];
    const raw = localStorage.getItem(KEYS.SUBJECTS);
    return raw ? JSON.parse(raw) : [];
}

export function getSubject(id) {
    return getSubjects().find(s => s.id === id) || null;
}

export function saveSubject(subject) {
    const subjects = getSubjects();
    const idx = subjects.findIndex(s => s.id === subject.id);
    if (idx >= 0) subjects[idx] = subject;
    else subjects.push(subject);
    localStorage.setItem(KEYS.SUBJECTS, JSON.stringify(subjects));
}

export function deleteSubject(id) {
    const subjects = getSubjects().filter(s => s.id !== id);
    localStorage.setItem(KEYS.SUBJECTS, JSON.stringify(subjects));
}

// ── Topic Progress ──
export function markTopicPassed(subjectId, topicIndex) {
    const subject = getSubject(subjectId);
    if (!subject) return;
    if (!subject.progress) subject.progress = {};
    subject.progress[topicIndex] = { passed: true, passedAt: Date.now() };
    // Also record streak
    recordStreak();
    saveSubject(subject);
}

export function isTopicPassed(subjectId, topicIndex) {
    const subject = getSubject(subjectId);
    return subject?.progress?.[topicIndex]?.passed || false;
}

export function getSubjectProgress(subjectId) {
    const subject = getSubject(subjectId);
    if (!subject) return 0;
    const total = subject.syllabus?.length || 1;
    const passed = Object.values(subject.progress || {}).filter(p => p.passed).length;
    return Math.round((passed / total) * 100);
}

export function getCurrentTopicIndex(subjectId) {
    const subject = getSubject(subjectId);
    if (!subject) return 0;
    const syllabus = subject.syllabus || [];
    for (let i = 0; i < syllabus.length; i++) {
        if (!subject.progress?.[i]?.passed) return i;
    }
    return syllabus.length - 1;
}

// ── Streaks ──
export function getStreakData() {
    if (typeof window === 'undefined') return {};
    const raw = localStorage.getItem(KEYS.STREAKS);
    return raw ? JSON.parse(raw) : {};
}

export function recordStreak() {
    const data = getStreakData();
    const today = new Date().toISOString().split('T')[0];
    data[today] = (data[today] || 0) + 1;
    localStorage.setItem(KEYS.STREAKS, JSON.stringify(data));
}

export function getCurrentStreak() {
    const data = getStreakData();
    let streak = 0;
    const d = new Date();
    while (true) {
        const key = d.toISOString().split('T')[0];
        if (data[key]) {
            streak++;
            d.setDate(d.getDate() - 1);
        } else {
            break;
        }
    }
    return streak;
}

// ── Chat History ──
export function getChatHistory(subjectId) {
    if (typeof window === 'undefined') return [];
    const raw = localStorage.getItem(KEYS.CHATS);
    const all = raw ? JSON.parse(raw) : {};
    return all[subjectId] || [];
}

export function saveChatThread(subjectId, thread) {
    const raw = localStorage.getItem(KEYS.CHATS);
    const all = raw ? JSON.parse(raw) : {};
    if (!all[subjectId]) all[subjectId] = [];
    const idx = all[subjectId].findIndex(t => t.id === thread.id);
    if (idx >= 0) all[subjectId][idx] = thread;
    else all[subjectId].push(thread);
    localStorage.setItem(KEYS.CHATS, JSON.stringify(all));
}

export function deleteChatThread(subjectId, threadId) {
    const raw = localStorage.getItem(KEYS.CHATS);
    const all = raw ? JSON.parse(raw) : {};
    if (all[subjectId]) {
        all[subjectId] = all[subjectId].filter(t => t.id !== threadId);
        localStorage.setItem(KEYS.CHATS, JSON.stringify(all));
    }
}

// ── Language ──
export function getLanguage() {
    if (typeof window === 'undefined') return 'en';
    return localStorage.getItem(KEYS.LANG) || 'en';
}

export function setLanguage(lang) {
    localStorage.setItem(KEYS.LANG, lang);
}

// ── ID generator ──
export function genId() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}
