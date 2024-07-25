export const getImageDimensions = (imageUrl: string) => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
            resolve({ width: img.width, height: img.height });
        };
        img.onerror = (error) => {
            reject(error);
        };
        img.src = imageUrl;
    });
};


const checkImageSizePromise = async (url: string) => {
    const data: any = await getImageDimensions(url);
    const height = data.height;
    const width = data.width;

    if (height > width) {
        return "potrait";
    } else if (height < width) {
        return "landscape";
    } else if (height === width) {
        return "square";
    }
};

export const checkImageSize = async (url: string) => {
    return await checkImageSizePromise(url)
}

export const getTimeConversationsLastMessage = (date: any) => {
    const Dates: any = new Date(date);
    const DateNow: any = new Date();

    const diffInMs = DateNow - Dates;
    const diffInMinutes = Math.floor(diffInMs / 60000);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInHoursOutput = getHours(Dates)
    const diffInDays = getDate2(Dates)
    // const diffInDays = Math.floor(diffInHours / 24);
    if (diffInMinutes === 0) {
        return `Now`;
    } else if (diffInMinutes < 60) {
        return `${diffInMinutes}m`;
    } else if (diffInHours < 24) {
        return `${diffInHoursOutput}`;
    } else {
        return `${diffInDays}`;
    }
}

export const getDate = (date: any) => {
    const Dates = new Date(date)
    const day = Dates.getDate();
    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    const month = monthNames[Dates.getMonth()];
    const year = Dates.getFullYear()

    return `${day < 10 ? `0${day}` : day} ${month} ${year}`;
}

export const getHours = (date: string | number | Date): string => {
    const Dates = new Date(date);


    const hours = String(Dates.getHours()).padStart(2, '0');
    const minutes = String(Dates.getMinutes()).padStart(2, '0');

    return `${hours}:${minutes}`;
}


export const getDate2 = (date: any) => {
    const Dates = new Date(date)
    const day = Dates.getDate();
    const month = Dates.getMonth() + 1;
    const year = Dates.getFullYear()

    return `${day < 10 ? `0${day}` : day}/${month < 10 ? `0${month}` : month}/${year}`;
}
