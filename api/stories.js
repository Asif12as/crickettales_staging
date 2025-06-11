// Stories API Endpoint
// This handles story listing, filtering, and management

export default async function handler(req, res) {
    if (req.method === 'GET') {
        try {
            const { page = 1, limit = 10, category, featured, userId } = req.query;

            // Simulate story data
            const allStories = [
                {
                    id: 1,
                    title: "The Greatest Catch Ever",
                    content: "It was the final over of the match, and the tension was palpable. The ball soared high into the evening sky...",
                    author: "Rahul Sharma",
                    authorId: "user_001",
                    category: "Match Moments",
                    votes: 45,
                    views: 234,
                    isPriority: true,
                    isBoosted: false,
                    createdAt: "2024-01-07T10:30:00Z",
                    updatedAt: "2024-01-07T15:45:00Z",
                    tags: ["catch", "final over", "tension"]
                },
                {
                    id: 2,
                    title: "My First Century",
                    content: "I still remember the day I scored my first century. The sun was beating down on the pitch...",
                    author: "Priya Patel",
                    authorId: "user_002",
                    category: "Personal Stories",
                    votes: 38,
                    views: 189,
                    isPriority: false,
                    isBoosted: true,
                    createdAt: "2024-01-06T14:20:00Z",
                    updatedAt: "2024-01-06T16:30:00Z",
                    tags: ["century", "first time", "achievement"]
                },
                {
                    id: 3,
                    title: "Rain Stopped Play",
                    content: "The clouds had been gathering all morning, but we thought we could finish the match...",
                    author: "Mike Johnson",
                    authorId: "user_003",
                    category: "Weather Stories",
                    votes: 32,
                    views: 156,
                    isPriority: false,
                    isBoosted: false,
                    createdAt: "2024-01-05T09:15:00Z",
                    updatedAt: "2024-01-05T11:20:00Z",
                    tags: ["rain", "weather", "interruption"]
                },
                {
                    id: 4,
                    title: "The Underdog Victory",
                    content: "Nobody expected our village team to win against the district champions...",
                    author: "Amit Kumar",
                    authorId: "user_004",
                    category: "Team Stories",
                    votes: 28,
                    views: 142,
                    isPriority: true,
                    isBoosted: true,
                    createdAt: "2024-01-04T16:45:00Z",
                    updatedAt: "2024-01-04T18:30:00Z",
                    tags: ["underdog", "victory", "village team"]
                },
                {
                    id: 5,
                    title: "Learning from Legends",
                    content: "When I met my cricket hero at the local ground, I never expected what happened next...",
                    author: "Sarah Williams",
                    authorId: "user_005",
                    category: "Inspiration",
                    votes: 41,
                    views: 198,
                    isPriority: false,
                    isBoosted: false,
                    createdAt: "2024-01-03T12:00:00Z",
                    updatedAt: "2024-01-03T14:15:00Z",
                    tags: ["legend", "inspiration", "learning"]
                }
            ];

            // Apply filters
            let filteredStories = allStories;
            
            if (category) {
                filteredStories = filteredStories.filter(story => 
                    story.category.toLowerCase().includes(category.toLowerCase())
                );
            }
            
            if (featured === 'true') {
                filteredStories = filteredStories.filter(story => 
                    story.isPriority || story.isBoosted || story.votes > 35
                );
            }
            
            if (userId) {
                filteredStories = filteredStories.filter(story => 
                    story.authorId === userId
                );
            }

            // Sort by priority, boost status, then votes
            filteredStories.sort((a, b) => {
                if (a.isPriority && !b.isPriority) return -1;
                if (!a.isPriority && b.isPriority) return 1;
                if (a.isBoosted && !b.isBoosted) return -1;
                if (!a.isBoosted && b.isBoosted) return 1;
                return b.votes - a.votes;
            });

            // Pagination
            const startIndex = (page - 1) * limit;
            const endIndex = startIndex + parseInt(limit);
            const paginatedStories = filteredStories.slice(startIndex, endIndex);

            res.status(200).json({
                success: true,
                stories: paginatedStories,
                pagination: {
                    currentPage: parseInt(page),
                    totalPages: Math.ceil(filteredStories.length / limit),
                    totalStories: filteredStories.length,
                    hasNext: endIndex < filteredStories.length,
                    hasPrev: page > 1
                },
                filters: {
                    category: category || null,
                    featured: featured || null,
                    userId: userId || null
                }
            });

        } catch (error) {
            console.error('Stories fetch error:', error);
            res.status(500).json({ 
                error: 'Internal server error',
                message: 'Failed to fetch stories'
            });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}