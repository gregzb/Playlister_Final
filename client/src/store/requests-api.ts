const baseUrl = "http://localhost:4000/api/";

// export type User = {
//     firstName: string;
//     lastName: string;
//     username: string;
//     email: string;
// };

export type Playlist = {
    _id: string;
    name: string;
    ownerEmail: string;
    username: string;
    songs: {
        title: string,
        artist: string,
        youTubeId: string
    }[];
    isPublished: boolean;
    publishDate: Date;
    lastEditedDate: Date;

    likes: [string];
    dislikes: [string];
    comments: [{
        username: string,
        text: string
    }];
    listens: number;
};

type ErrT = {
    error: true;
    errorMsg: string;
};

type SuccessT = {
    error: false;
};

const exceptionWrapper = <T>(f: (...args: any[]) => Promise<ErrT | T>) => {
    return async (...args: any[]): Promise<ErrT | T> => {
        try {
            return await f(...args);
        } catch (err) {
            console.log(`Logged: Issue with function ${f.name}: ${err}`);
            return new Promise((res) => {
                res({
                    error: true,
                    errorMsg: `Issue with function ${f.name}: ${err}`
                });
            });
        }
    };
}

export const createPlaylist = exceptionWrapper(async (name: string, songs: {
    title: string,
    artist: string,
    youTubeId: string
}[]): Promise<ErrT | SuccessT & {
    playlists: Playlist[]
}> => {
    const res = await fetch(`${baseUrl}/playlist`, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({name, songs})
    });
    return await res.json();
});

export const updatePlaylistDetails = exceptionWrapper(async (playlist: Playlist): Promise<ErrT | SuccessT & {
    playlist: Playlist
}> => {
    const res = await fetch(`${baseUrl}/playlist/details/${playlist._id}`, {
        method: "PUT",
        credentials: "include",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(playlist)
    });
    return await res.json();
});

export const getPlaylists = exceptionWrapper(async (whose: "own" | "all" | "user", username: string | undefined): Promise<ErrT | SuccessT & {
    playlists: Playlist[]
}> => {
    const res = await fetch(`${baseUrl}/playlists/${whose}/${username ? `username=${username}` : ""}`, {
        method: "GET",
        credentials: "include",
    });
    return await res.json();
});