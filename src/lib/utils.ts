import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function removeUndefinedOrNull<T, U>(
    arr: T[] | undefined,
    transform: (item: T) => U | undefined | null
): T[] {
    if (!arr) return [];

    return arr.filter((item): item is T => {
        const transformed = transform(item);
        return transformed !== undefined && transformed !== null;
    });
}

export function uniqueValues<T>(arr: T[]): T[] {
    return Array.from(new Set(arr));
}
