"use client";

import { updateEvent, UpdateEventState } from "@/lib/event-actions";
import { useRouter } from "next/navigation";
import { useActionState, useEffect } from "react";

type EditEventFormProps = {
  event: {
    id: string;
    title: string;
    description: string;
    date: string;
    location: string;
    maxAttendees: number | null;
    isPublic: boolean;
  };
};

const initialState: UpdateEventState = {
  success: false,
  eventId: null,
  error: "",
};

export default function EditEventForm({ event }: EditEventFormProps) {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(
    updateEvent,
    initialState
  );

  useEffect(() => {
    if (state.success && state.eventId) {
      router.push(`/events/${state.eventId}`);
    }
  }, [state.success, state.eventId, router]);

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Edit Event</h1>
        <p className="text-muted mt-2">Update the details for this event</p>
      </div>
      <form className="space-y-6" action={formAction}>
        <input type="hidden" name="eventId" value={event.id} />

        <div>
          <label
            htmlFor="title"
            className="block text-sm text-foreground font-medium mb-2"
          >
            Event Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            required
            className="input-field"
            defaultValue={event.title}
            placeholder="Enter event title"
          />
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-sm text-foreground font-medium mb-2"
          >
            Description *
          </label>
          <textarea
            id="description"
            name="description"
            required
            rows={4}
            className="input-field"
            defaultValue={event.description}
            placeholder="Enter event description"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="date"
              className="block text-sm text-foreground font-medium mb-2"
            >
              Date & Time *
            </label>
            <input
              type="datetime-local"
              id="date"
              name="date"
              required
              className="input-field"
              defaultValue={event.date}
            />
          </div>

          <div>
            <label
              htmlFor="location"
              className="block text-sm text-foreground font-medium mb-2"
            >
              Location *
            </label>
            <input
              type="text"
              id="location"
              name="location"
              required
              className="input-field"
              defaultValue={event.location}
              placeholder="Enter event location"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="maxAttendees"
              className="block text-sm text-foreground font-medium mb-2"
            >
              Maximum Attendees
            </label>
            <input
              type="number"
              id="maxAttendees"
              name="maxAttendees"
              min="1"
              className="input-field"
              defaultValue={event.maxAttendees ?? undefined}
              placeholder="Leave empty for unlimited"
            />
          </div>

          <div>
            <label
              htmlFor="isPublic"
              className="block text-sm text-foreground font-medium mb-2"
            >
              Event Visibility
            </label>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isPublic"
                name="isPublic"
                defaultChecked={event.isPublic}
                className="h-4 w-4 text-primary focus:ring-primary border-slate-600 rounded bg-slate-800"
              />
              <label htmlFor="isPublic" className="text-foreground ml-2 block text-sm">
                Make this event public
              </label>
            </div>
          </div>
        </div>

        {state.error && (
          <div className="bg-red-600/10 border border-red-600/20 rounded-md p-4">
            <p className="text-sm text-red-400">{state.error}</p>
          </div>
        )}

        <div className="flex gap-4">
          <button className="btn-primary" type="submit" disabled={isPending}>
            {isPending ? "Saving..." : "Save Changes"}
          </button>
          <button
            className="btn-secondary"
            type="button"
            onClick={() => router.push(`/events/${event.id}`)}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
