export type RSVPStatus = "GOING" | "NOT_GOING" | "MAYBE";

export interface EventListItem {
  id: string;
  title: string;
  description: string;
  date: Date;
  location: string;
  maxAttendees: number | null;
  userId: string;
  isPublic: boolean;
  user: {
    name: string | null;
    email: string | null;
  };
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: Date;
  location: string;
  maxAttendees: number | null;
  userId: string;
  isPublic: boolean;
  user: {
    name: string | null;
    email: string | null;
  };
  rsvps: EventRSVP[];
  _count: {
    rsvps: number;
  };
}

export interface EventRSVP {
  userId: string;
  status: RSVPStatus;
  user: {
    name: string | null;
  };
  event?: {
    id: string;
    title: string;
    description: string;
    date: Date;
    user: {
      name: string | null;
    };
  };
}

export interface DashboardEvent {
  id: string;
  title: string;
  description: string;
  date: Date;
  _count: {
    rsvps: number;
  };
}
