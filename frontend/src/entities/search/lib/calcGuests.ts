import type { GuestCategories } from '../model/types';

export const calcGuests = (guestCategories: GuestCategories): number =>
    guestCategories.adults + guestCategories.children;
