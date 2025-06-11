// Story Submission API Endpoint
// This simulates the story submission functionality from Sahil's module

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { title, content, author, isPriority } = req.body;

        // Validate required fields
        if (!title || !content || !author) {
            return res.status(400).json({ 
                error: 'Missing required fields: title, content, author' 
            });
        }

        // Simulate story creation
        const story = {
            id: Date.now(), // Simple ID generation
            title,
            content,
            author,
            isPriority: isPriority || false,
            votes: 0,
            createdAt: new Date().toISOString(),
            status: 'published'
        };

        // In a real implementation, this would save to a database
        console.log('Story submitted:', story);

        res.status(201).json({
            success: true,
            story,
            message: 'Story submitted successfully'
        });

    } catch (error) {
        console.error('Story submission error:', error);
        res.status(500).json({ 
            error: 'Internal server error',
            message: 'Failed to submit story'
        });
    }
}