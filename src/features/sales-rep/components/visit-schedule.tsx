import {
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Navigation,
  Phone,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";

const mockVisits = [
  {
    id: 1,
    farmName: "Makiling Farm",
    location: "Laguna",
    contactPerson: "Juan Santos",
    phone: "+63 917 123 4567",
    visitType: "follow-up",
    status: "upcoming",
    scheduledDate: new Date("2024-01-16T09:00:00"),
    priority: "high",
    notes: "Follow up on fertilizer order, check crop progress",
    coordinates: { lat: 14.1693, lng: 121.2417 },
    completed: false,
  },
  {
    id: 2,
    farmName: "Sunrise Agriculture",
    location: "Bataan",
    contactPerson: "Maria Rodriguez",
    phone: "+63 918 234 5678",
    visitType: "new-prospect",
    status: "upcoming",
    scheduledDate: new Date("2024-01-16T14:00:00"),
    priority: "medium",
    notes: "Initial consultation, present product catalog",
    coordinates: { lat: 14.7951, lng: 120.4825 },
    completed: false,
  },
  {
    id: 3,
    farmName: "Golden Harvest Co.",
    location: "Pampanga",
    contactPerson: "Pedro Cruz",
    phone: "+63 919 345 6789",
    visitType: "follow-up",
    status: "overdue",
    scheduledDate: new Date("2024-01-14T10:30:00"),
    priority: "high",
    notes: "Overdue payment discussion, new order placement",
    coordinates: { lat: 15.0794, lng: 120.62 },
    completed: false,
  },
  {
    id: 4,
    farmName: "Verde Valley Farm",
    location: "Nueva Ecija",
    contactPerson: "Ana Lim",
    phone: "+63 920 456 7890",
    visitType: "maintenance",
    status: "upcoming",
    scheduledDate: new Date("2024-01-17T08:00:00"),
    priority: "low",
    notes: "Equipment maintenance check, routine visit",
    coordinates: { lat: 15.5784, lng: 120.9806 },
    completed: false,
  },
  {
    id: 5,
    farmName: "Pacific Agri Corp",
    location: "Tarlac",
    contactPerson: "Roberto Tan",
    phone: "+63 921 567 8901",
    visitType: "follow-up",
    status: "overdue",
    scheduledDate: new Date("2024-01-13T13:00:00"),
    priority: "high",
    notes: "Contract renewal discussion, urgent follow-up",
    coordinates: { lat: 15.475, lng: 120.5969 },
    completed: false,
  },
  {
    id: 6,
    farmName: "Mountain View Farms",
    location: "Benguet",
    contactPerson: "Lisa Garcia",
    phone: "+63 922 678 9012",
    visitType: "new-prospect",
    status: "upcoming",
    scheduledDate: new Date("2024-01-18T11:00:00"),
    priority: "medium",
    notes: "High-altitude farming consultation",
    coordinates: { lat: 16.4023, lng: 120.596 },
    completed: false,
  },
  {
    id: 7,
    farmName: "Central Plains Farm",
    location: "Nueva Ecija",
    contactPerson: "Miguel Torres",
    phone: "+63 923 789 0123",
    visitType: "follow-up",
    status: "overdue",
    scheduledDate: new Date("2024-01-12T10:00:00"),
    priority: "medium",
    notes: "Quarterly review and new product introduction",
    coordinates: { lat: 15.5784, lng: 120.9806 },
    completed: false,
  },
];

const formatDateTime = (date: Date) => {
  const timeString = date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  return timeString;
};

const formatDateOnly = (date: Date) => {
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
};

const getStatusColor = (status: string, priority: string) => {
  if (status === "overdue") {
    return "text-red-600 dark:text-red-400";
  }
  if (priority === "high") {
    return "text-orange-600 dark:text-orange-400";
  }
  return "text-blue-600 dark:text-blue-400";
};

const getStatusBadge = (status: string, priority: string) => {
  if (status === "overdue") {
    return "bg-red-600 text-red-50";
  }
  if (priority === "high") {
    return "bg-orange-600 text-orange-50";
  }
  return "bg-blue-600 text-blue-50";
};

const handleGPSNavigation = (
  coordinates: { lat: number; lng: number },
  farmName: string
) => {
  const url = `https://www.google.com/maps/dir/?api=1&destination=${coordinates.lat},${coordinates.lng}&destination_place_id=${encodeURIComponent(farmName)}`;
  window.open(url, "_blank");
};

const handleCall = (phone: string) => {
  window.open(`tel:${phone}`, "_self");
};

const handleMessage = (phone: string) => {
  window.open(`sms:${phone}`, "_self");
};

const VisitItem: React.FC<{
  visit: (typeof mockVisits)[0];
  onToggleComplete: (id: number) => void;
  showActions?: boolean;
  compact?: boolean;
  isOverdue?: boolean;
}> = ({
  visit,
  onToggleComplete,
  showActions = true,
  compact = false,
  isOverdue = false,
}) => {
  const timeString = formatDateTime(visit.scheduledDate);

  if (compact) {
    return (
      <div
        className={`flex items-center gap-2 px-2 py-1 rounded text-xs ${
          isOverdue
            ? "bg-red-50/50 dark:bg-red-950/10 border border-red-100 dark:border-red-900/30"
            : "bg-muted/70"
        }`}
      >
        <Checkbox
          checked={visit.completed}
          onCheckedChange={() => onToggleComplete(visit.id)}
          className="size-3"
        />
        <span className="font-medium truncate">{visit.farmName}</span>
        <span className="text-muted-foreground">{timeString}</span>
      </div>
    );
  }

  return (
    <div
      className={`rounded-lg border px-3 py-3 ${
        isOverdue
          ? "bg-red-50/30 dark:bg-red-950/5 border-red-100 dark:border-red-900/20"
          : "bg-muted/70 border-border"
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-1">
          <Checkbox
            checked={visit.completed}
            onCheckedChange={() => onToggleComplete(visit.id)}
            className="size-4"
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h4 className="font-display font-medium text-sm tracking-tight">
                  {visit.farmName}
                </h4>
                {isOverdue && (
                  <Badge className="text-[10px] px-2 h-fit py-0 rounded-sm bg-red-100 dark:bg-red-950/30 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800">
                    Overdue
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2 mt-1">
                <MapPin className="h-3 w-3 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">
                  {visit.location}
                </span>
                <span className="text-xs text-muted-foreground">•</span>
                <span className="text-xs text-muted-foreground">
                  {visit.contactPerson}
                </span>
              </div>
              <p className="text-xs mt-1 text-muted-foreground">
                {visit.notes}
              </p>

              {showActions && (
                <div className="flex items-center gap-2 mt-2">
                  <button
                    onClick={() =>
                      handleGPSNavigation(visit.coordinates, visit.farmName)
                    }
                    className="flex items-center gap-1 px-2 py-1 text-xs bg-muted/70 hover:bg-muted transition-colors rounded"
                  >
                    <Navigation className="h-3 w-3" />
                    GPS
                  </button>
                  <button
                    onClick={() => handleCall(visit.phone)}
                    className="flex items-center gap-1 px-2 py-1 text-xs bg-muted/70 hover:bg-muted transition-colors rounded"
                  >
                    <Phone className="h-3 w-3" />
                    Call
                  </button>
                  <button
                    onClick={() => handleMessage(visit.phone)}
                    className="flex items-center gap-1 px-2 py-1 text-xs bg-muted/70 hover:bg-muted transition-colors rounded"
                  >
                    <MessageCircle className="h-3 w-3" />
                    SMS
                  </button>
                </div>
              )}
            </div>
            <div className="flex flex-col items-end text-right flex-shrink-0">
              <div className="flex items-center gap-1">
                <Clock
                  className={`h-3 w-3 ${getStatusColor(visit.status, visit.priority)}`}
                />
                <span className="text-xs font-medium text-foreground font-sans">
                  {timeString}
                </span>
              </div>
              <span className="text-xs text-muted-foreground font-sans">
                {formatDateOnly(visit.scheduledDate)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const MiniCalendar: React.FC<{
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  visits: typeof mockVisits;
}> = ({ selectedDate, onDateSelect, visits }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const daysInMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0
  ).getDate();
  const firstDayOfMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    1
  ).getDay();
  const today = new Date();

  const monthYear = currentMonth.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const handlePrevMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1)
    );
  };

  const handleNextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1)
    );
  };

  const getVisitsForDate = (date: Date) => {
    return visits.filter(
      (visit) => visit.scheduledDate.toDateString() === date.toDateString()
    ).length;
  };

  const renderCalendarDays = () => {
    const days = [];

    // Empty cells for days before the month starts
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="h-8" />);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth(),
        day
      );
      const isSelected = date.toDateString() === selectedDate.toDateString();
      const isToday = date.toDateString() === today.toDateString();
      const visitCount = getVisitsForDate(date);

      days.push(
        <button
          key={day}
          onClick={() => onDateSelect(date)}
          className={`relative h-8 w-8 text-xs rounded-sm flex items-center justify-center hover:bg-muted/50 transition-colors ${
            isSelected
              ? "bg-primary text-primary-foreground"
              : isToday
                ? "bg-blue-100 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300"
                : "text-foreground"
          }`}
        >
          {day}
          {visitCount > 0 && (
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-orange-500 rounded-full flex items-center justify-center">
              <span className="text-[8px] text-white font-bold">
                {visitCount}
              </span>
            </div>
          )}
        </button>
      );
    }

    return days;
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <button
          onClick={handlePrevMonth}
          className="p-1 hover:bg-muted/50 rounded"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <h4 className="font-medium text-sm">{monthYear}</h4>
        <button
          onClick={handleNextMonth}
          className="p-1 hover:bg-muted/50 rounded"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-xs text-muted-foreground">
        {["S", "M", "T", "W", "T", "F", "S"].map((day) => (
          <div
            key={day}
            className="h-6 flex items-center justify-center font-medium"
          >
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">{renderCalendarDays()}</div>
    </div>
  );
};

const VisitSchedule: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  );

  const today = new Date();

  const todaysVisits = mockVisits.filter((visit) => {
    const visitDate = visit.scheduledDate;
    return visitDate.toDateString() === today.toDateString();
  });

  const selectedDateVisits = selectedDate
    ? mockVisits.filter((visit) => {
        const visitDate = visit.scheduledDate;
        return visitDate.toDateString() === selectedDate.toDateString();
      })
    : [];

  const nextVisits = mockVisits
    .filter((visit) => {
      const visitDate = visit.scheduledDate;
      return visitDate > today && visit.status !== "overdue";
    })
    .sort((a, b) => a.scheduledDate.getTime() - b.scheduledDate.getTime())
    .slice(0, 3);

  const overdueVisits = mockVisits.filter(
    (visit) => visit.status === "overdue"
  );

  const handleToggleComplete = (id: number) => {
    // In a real app, this would update the state/database
    console.log(`Toggling completion for visit ${id}`);
  };

  const totalVisits = mockVisits.length;
  const completedVisits = mockVisits.filter((v) => v.completed).length;
  const overdueCount = overdueVisits.length;

  // Get dates with visits for calendar highlighting
  const datesWithVisits = mockVisits.map((visit) => visit.scheduledDate);

  return (
    <div className="bg-card rounded-lg border border-border space-y-6">
      {/* Header */}
      <div className="pt-4 px-4">
        <div className="flex items-center justify-between">
          <h3 className="text-foreground font-display font-medium text-base tracking-tight">
            My Visit Schedule
          </h3>
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3 w-3 text-green-600 dark:text-green-400" />
              <span className="text-muted-foreground font-sans">Completed</span>
              <span className="font-medium text-foreground font-sans">
                {completedVisits}/{totalVisits}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <AlertCircle className="h-3 w-3 text-red-600 dark:text-red-400" />
              <span className="text-muted-foreground font-sans">Overdue</span>
              <span className="font-medium text-foreground font-sans">
                {overdueCount}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Overdue Follow-ups - Prominent Position */}
      {overdueVisits.length > 0 && (
        <div className="px-4 space-y-3">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
            <h4 className="font-medium text-sm text-red-700 dark:text-red-300">
              Overdue Follow-ups ({overdueVisits.length}) - Requires Immediate
              Attention
            </h4>
          </div>
          <div className="space-y-2">
            {overdueVisits.slice(0, 2).map((visit) => (
              <VisitItem
                key={visit.id}
                visit={visit}
                onToggleComplete={handleToggleComplete}
                showActions={true}
                isOverdue={true}
              />
            ))}

            {overdueVisits.length > 2 && (
              <Dialog>
                <DialogTrigger asChild>
                  <div className="rounded-lg border-2 border-dashed border-red-200 dark:border-red-800/50 px-3 py-2 cursor-pointer hover:border-red-300 dark:hover:border-red-700 transition-colors">
                    <div className="flex items-center justify-center gap-2">
                      <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                      <span className="text-sm text-red-700 dark:text-red-300 font-sans">
                        +{overdueVisits.length - 2} more overdue visits
                      </span>
                    </div>
                  </div>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>All Overdue Follow-ups</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-3 mt-4">
                    {overdueVisits.map((visit) => (
                      <VisitItem
                        key={visit.id}
                        visit={visit}
                        onToggleComplete={handleToggleComplete}
                        showActions={true}
                        isOverdue={true}
                      />
                    ))}
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 px-4">
        {/* Calendar View */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
            <h4 className="font-medium text-sm">Calendar View</h4>
          </div>
          <div className="bg-muted/20 rounded-lg p-4">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="w-full"
              modifiers={{
                hasVisits: datesWithVisits,
              }}
            />
          </div>

          {/* Selected Date Visits */}
          <div className="space-y-2">
            <h5 className="font-medium text-sm">
              {selectedDate &&
              selectedDate.toDateString() === today.toDateString()
                ? "Today's Schedule"
                : selectedDate
                  ? `${formatDateOnly(selectedDate)} Schedule`
                  : "Select a date"}
            </h5>
            {selectedDateVisits.length > 0 ? (
              <div className="space-y-2">
                {selectedDateVisits.map((visit) => (
                  <VisitItem
                    key={visit.id}
                    visit={visit}
                    onToggleComplete={handleToggleComplete}
                    compact={true}
                    isOverdue={visit.status === "overdue"}
                  />
                ))}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground py-4 text-center bg-muted/30 rounded">
                {selectedDate
                  ? "No visits scheduled for this date"
                  : "Select a date to view schedule"}
              </p>
            )}
          </div>
        </div>

        {/* Today's Planner & Next Visits - Side by Side */}
        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-5 gap-4">
          {/* Today's Planner - Smaller Column */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <h4 className="font-medium text-sm">Today's Planner</h4>
            </div>

            {todaysVisits.length > 0 ? (
              <div className="space-y-2">
                {todaysVisits.map((visit) => (
                  <VisitItem
                    key={visit.id}
                    visit={visit}
                    onToggleComplete={handleToggleComplete}
                    showActions={false}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-muted/70 rounded-lg p-4 text-center">
                <p className="text-sm text-muted-foreground">
                  No visits scheduled for today
                </p>
              </div>
            )}
          </div>

          {/* Next Visits - Larger Column */}
          <div className="md:col-span-3 space-y-3">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <h4 className="font-medium text-sm">Next Visits</h4>
            </div>

            {nextVisits.length > 0 ? (
              <div className="space-y-2">
                {nextVisits.map((visit) => (
                  <div key={visit.id} className="bg-muted/70 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <Checkbox
                            checked={visit.completed}
                            onCheckedChange={() =>
                              handleToggleComplete(visit.id)
                            }
                            className="size-3"
                          />
                          <h5 className="font-medium text-sm truncate">
                            {visit.farmName}
                          </h5>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <MapPin className="h-3 w-3 text-muted-foreground ml-5" />
                          <p className="text-xs text-muted-foreground">
                            {visit.location}
                          </p>
                          <span className="text-xs text-muted-foreground">
                            •
                          </span>
                          <p className="text-xs text-muted-foreground">
                            {visit.contactPerson}
                          </p>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0 ml-4">
                        <p className="text-xs font-medium">
                          {formatDateTime(visit.scheduledDate)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatDateOnly(visit.scheduledDate)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-muted/70 rounded-lg p-4 text-center">
                <p className="text-sm text-muted-foreground">
                  No upcoming visits scheduled
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="px-4 pb-4">
        <div className="text-center">
          <p className="text-xs text-muted-foreground font-sans">
            Follow-up actions and visit logs • GPS navigation available
          </p>
        </div>
      </div>
    </div>
  );
};

export default VisitSchedule;
