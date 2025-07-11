// Define interfaces for your workflow templates
// Example usage (you would populate this from your backend or static data)
export const predefinedWorkflowTemplates = [
    {
        id: 'template-1',
        name: 'New Google Calendar Event to Slack Notification',
        description: 'Triggers a Slack message when a new event is created in Google Calendar.',
        category: 'Productivity',
        createdAt: new Date(),
        updatedAt: new Date(),
        isPublished: true,
        tags: ['Google Calendar', 'Slack', 'Notification'],
        icon: 'calendar-slack',
    },
    {
        id: 'template-2',
        name: 'Automate ETH Transfer on Specific Event',
        description: 'Transfers Ethereum when a predefined on-chain event occurs.',
        category: 'Blockchain',
        createdAt: new Date(),
        updatedAt: new Date(),
        isPublished: true,
        tags: ['Ethereum', 'Smart Contract', 'Crypto'],
        icon: 'ethereum',
    },
    // Add more template definitions here
];
