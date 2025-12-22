import React, { useState, useEffect } from "react";
import "./events.css";
import TitleWithAddButton from "./title/titleWithAddButton/titleWithAddButton";
import FutureEventsButton from "./title/futureEventsButton/futureEventsButton";
import PastEventsButton from "./title/pastEventsButton/pastEventsButton";
import ModalAddWindow from "./modalAddWindow/modalAddWindow";
import EventCard from "./EventCard/EventCard";
import { getAllParticipants } from "../../utils/participantsManager";

function EventsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [editingEvent, setEditingEvent] = useState(null);
  const [activeTab, setActiveTab] = useState("future");
  const [events, setEvents] = useState(() => {
    const savedEvents = localStorage.getItem("events");
    return savedEvents ? JSON.parse(savedEvents) : [];
  });

  useEffect(() => {
    getAllParticipants();
  }, []);

  useEffect(() => {
    localStorage.setItem("events", JSON.stringify(events));
  }, [events]);

  const handleAddClick = () => {
    setModalMode("create");
    setEditingEvent(null);
    setIsModalOpen(true);
  };

  const handleEditEvent = (event) => {
    setModalMode("edit");
    setEditingEvent(event);
    setIsModalOpen(true);
  };

  const handleCreateEvent = (newEventData) => {
    const newEvent = {
      id: Date.now(),
      ...newEventData,
      organizers: newEventData.organizers || "",
      createdAt: new Date().toISOString(),
    };

    setEvents((prevEvents) => [...prevEvents, newEvent]);
    setIsModalOpen(false);
  };

  const handleUpdateEvent = (updatedEventData) => {
    setEvents((prevEvents) =>
      prevEvents.map((event) =>
        event.id === editingEvent.id ? { ...event, ...updatedEventData } : event
      )
    );
    setIsModalOpen(false);
    setEditingEvent(null);
  };

  const handleDeleteEvent = (eventId) => {
    if (window.confirm("Вы уверены, что хотите удалить это мероприятие?")) {
      setEvents((prevEvents) =>
        prevEvents.filter((event) => event.id !== eventId)
      );
    }
  };

  const handleDeleteEventFromModal = () => {
    if (editingEvent) {
      handleDeleteEvent(editingEvent.id);
    }
  };

  const filterEvents = (tab) => {
    const now = new Date();
    return events
      .filter((event) => {
        const eventDate = new Date(event.date);
        if (tab === "future") {
          return eventDate >= now;
        } else {
          return eventDate < now;
        }
      })
      .sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateA.getTime() - dateB.getTime();
      });
  };

  const displayedEvents = filterEvents(activeTab);

  return (
    <section className="eventsPage">
      <div className="eventsHeaderSection">
        <TitleWithAddButton title="Мероприятия" onAddClick={handleAddClick} />
        <div className="eventsTabsContainer">
          <PastEventsButton
            isActive={activeTab === "past"}
            onClick={() => setActiveTab("past")}
          />
          <FutureEventsButton
            isActive={activeTab === "future"}
            onClick={() => setActiveTab("future")}
          />
        </div>
      </div>

      <div className="eventsGrid">
        {displayedEvents.length > 0 ? (
          displayedEvents.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              onEdit={handleEditEvent}
              onDelete={handleDeleteEvent}
            />
          ))
        ) : (
          <p className="noEventsMessage">
            {activeTab === "future"
              ? "Пока нет будущих мероприятий."
              : "Пока нет прошедших мероприятий."}
          </p>
        )}
      </div>

      {isModalOpen && (
        <ModalAddWindow
          onClose={() => {
            setIsModalOpen(false);
            setEditingEvent(null);
          }}
          onSubmit={
            modalMode === "create" ? handleCreateEvent : handleUpdateEvent
          }
          onDelete={handleDeleteEventFromModal}
          eventToEdit={editingEvent}
          mode={modalMode}
        />
      )}
    </section>
  );
}

export default EventsPage;
