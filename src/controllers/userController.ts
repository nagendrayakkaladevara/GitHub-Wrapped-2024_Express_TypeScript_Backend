import { Request, Response } from 'express';

// Get all users
export const getData = async (req: Request, res: Response): Promise<void> => {
    console.log('Fetching GitHub data...');
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Basic ')) {
            res.status(401).json({ message: 'Unauthorized: Missing or invalid Authorization header' });
            return;
        }

        const base64Credentials = authHeader.split(' ')[1];
        const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
        const [providedUsername, providedPassword] = credentials.split(':');

        const expectedUsername = 'nagendra'; 
        const expectedPassword = 'yakkaladevara'; 

        if (providedUsername !== expectedUsername || providedPassword !== expectedPassword) {
            res.status(401).json({ message: 'Unauthorized: Invalid username or password' });
            return;
        }

        const { username } = req.params;

        if (!username) {
            res.status(400).json({ message: "Username is required in the parameters." });
            return;
        }

        const response = await fetch(`https://git-wrapped.com/api/github/stats?username=${username}`);
        const reposResponse = await fetch(`https://api.github.com/users/${username}/repos`);

        if (!response.ok) {
            throw new Error(`Failed to fetch GitHub stats data: ${response.statusText}`);
        }

        if (!reposResponse.ok) {
            throw new Error(`Failed to fetch GitHub repos data: ${reposResponse.statusText}`);
        }

        const githubData = await response.json();
        const gitRepoData = await reposResponse.json();

        const reposCreatedIn2024 = gitRepoData.filter((repo: any) => {
            const createdYear = new Date(repo.created_at).getFullYear();
            return createdYear === 2024;
        });

        const {
            longestStreak,
            topLanguages,
            starsEarned,
            mostActiveDay,
            mostActiveMonth,
            totalCommits,
            calendarData
        } = githubData;

        res.status(200).json({
            username,
            longestStreak,
            topLanguages,
            starsEarned,
            mostActiveDay,
            mostActiveMonth,
            totalCommits,
            reposCreatedIn2024Count: reposCreatedIn2024.length,
            contributions: calendarData
        });
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};