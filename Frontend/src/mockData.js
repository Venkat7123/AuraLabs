// Simple mock data so the frontend can run without any backend/API calls.

export const mockStreakData = (() => {
    const data = {};
    const today = new Date();
    // Mark the last 10 days as active
    for (let i = 0; i < 10; i++) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        const key = d.toISOString().split('T')[0];
        data[key] = 1;
    }
    return data;
})();

export const mockSubjects = [
    {
        id: 'javascript-fundamentals',
        name: 'JavaScript Fundamentals',
        need: 'Learn the basics of JavaScript for modern web development.',
        duration: 4,
        level: 'Beginner',
        intensity: 'Regular',
        created_at: new Date().toISOString(),
        syllabus: [
            { id: 'js-1', title: 'Variables & Data Types', order: 0 },
            { id: 'js-2', title: 'Functions & Scope', order: 1 },
            { id: 'js-3', title: 'Arrays & Objects', order: 2 },
            { id: 'js-4', title: 'DOM Basics', order: 3 },
        ],
        progress: {
            0: { passed: true, passedAt: Date.now() - 86400000 },
            1: { passed: false },
            2: { passed: false },
            3: { passed: false },
        },
    },
    {
        id: 'python-intro',
        name: 'Python for Beginners',
        need: 'Get comfortable writing basic Python scripts.',
        duration: 6,
        level: 'Beginner',
        intensity: 'Casual',
        created_at: new Date().toISOString(),
        syllabus: [
            { id: 'py-1', title: 'Syntax & Variables', order: 0 },
            { id: 'py-2', title: 'Control Flow', order: 1 },
            { id: 'py-3', title: 'Functions', order: 2 },
        ],
        progress: {},
    },
];
