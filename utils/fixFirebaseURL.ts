export const fixFirebaseURL = (str: string): string => str.replace(/jpg(.*)alt=media/g, 'jpg?alt=media');