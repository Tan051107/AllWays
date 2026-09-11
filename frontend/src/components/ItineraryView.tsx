import React, { useState } from 'react';
import { ItineraryStop } from '../types';
import { ITINERARY_STOPS } from '../data/initialData';
import wayloMascot from '../assets/waylo-mascot.png';

const TRIPS = [
  { id: 'tokyo', name: 'Tokyo Spring Escape', dates: 'May 12–19', status: 'Confirmed', statusClass: 'bg-[#dffbed] text-[#006c51]', subtitle: 'Every stop is pre-vetted for step-free access' },
  { id: 'penang', name: 'Penang Food Weekend', dates: 'Jun 7–9', status: 'Draft', statusClass: 'bg-[#fff0ec] text-[#aa2f1f]', subtitle: 'Awaiting group review and confirmation' },
  { id: 'kyoto', name: 'Kyoto Culture Days', dates: 'Oct 21–24', status: 'Ready to confirm', statusClass: 'bg-amber-100 text-amber-800', subtitle: 'All group profiles are complete' },
];

const ALT_STOPS: ItineraryStop[] = [
  { id: 'alt-1', time: '10:00', tag: 'FOOD', title: 'Gurney Drive Hawker Centre', subtitle: 'Penang Food Weekend', features: ['Step-free seating route', 'Vegetarian options nearby'], badges: [{ label: 'CONFIRM ACCESSIBILITY', type: 'yellow' }], votes: 3, wayloRationale: 'Short travel distances and flexible seating keep the day low fatigue.' },
  { id: 'alt-2', time: '14:00', tag: 'CULTURE', title: 'Cheong Fatt Tze Mansion', subtitle: 'Guided visit', features: ['Ramp entrance request noted', 'Rest break scheduled after visit'], badges: [], votes: 2 },
];

const PLANNING_STOPS_BY_DAY: Record<'day1' | 'day2' | 'day3', ItineraryStop[]> = {
  day1: ALT_STOPS,
  day2: [
    { id: 'alt-3', time: '09:30', tag: 'CULTURE', title: 'Clan Jetties', subtitle: 'Morning waterfront visit', features: ['Level boardwalk access', 'Rest stop nearby'], badges: [{ label: 'CONFIRM ACCESSIBILITY', type: 'yellow' }], votes: 2, wayloRationale: 'A short waterfront route with a planned rest keeps the morning low fatigue.' },
    { id: 'alt-4', time: '13:00', tag: 'FOOD', title: 'Little India lunch', subtitle: 'Flexible group lunch', features: ['Step-free seating request', 'Vegetarian options nearby'], badges: [], votes: 1 },
  ],
  day3: [
    { id: 'alt-5', time: '10:00', tag: 'NATURE', title: 'Penang Botanic Gardens', subtitle: 'Gentle morning route', features: ['Paved garden paths', 'Accessible restroom near entrance'], badges: [], votes: 3, wayloRationale: 'The flatter garden loop offers a calm final day with predictable rest points.' },
    { id: 'alt-6', time: '14:30', tag: 'LEISURE', title: 'Gurney Plaza break', subtitle: 'Indoor rest and shopping', features: ['Elevator access', 'Accessible restroom on every level'], badges: [{ label: 'STEP-FREE', type: 'green' }], votes: 2 },
  ],
};

interface ItineraryViewProps {
  activeTripId: string;
  onTripChange: (tripId: string) => void;
  planningTravelerCount: number;
  viewerRole: 'host' | 'participant';
  onCreateTrip: () => void;
  initialViewMode?: 'overview' | 'details';
}

export const ItineraryView: React.FC<ItineraryViewProps> = ({ activeTripId, onTripChange, planningTravelerCount, viewerRole, onCreateTrip, initialViewMode = 'details' }) => {
  const [selectedDay, setSelectedDay] = useState<'day1' | 'day2' | 'day3'>('day1');
  const [stops, setStops] = useState<ItineraryStop[]>(ITINERARY_STOPS);
  const [expandedRationale, setExpandedRationale] = useState<string | null>('stop-5');
  const [viewMode, setViewMode] = useState<'overview' | 'details'>(initialViewMode);
  const [planningStage, setPlanningStage] = useState<'planning' | 'review' | 'accommodation' | 'confirmed'>('planning');
  const [planningStops, setPlanningStops] = useState<Record<'day1' | 'day2' | 'day3', ItineraryStop[]>>(PLANNING_STOPS_BY_DAY);
  const [selectedStay, setSelectedStay] = useState<string | null>(null);
  const [adjustmentRequest, setAdjustmentRequest] = useState('');
  const [wayloProposal, setWayloProposal] = useState<string | null>(null);
  const [commentStopId, setCommentStopId] = useState<string | null>(null);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState<Record<string, string>>({});
  const [changeRequests, setChangeRequests] = useState<Record<string, 'remove' | 'replace'>>({});
  const [selectedInputStopId, setSelectedInputStopId] = useState<string | null>(null);
  const selectedTrip = TRIPS.find((trip) => trip.id === activeTripId) ?? TRIPS[0];
  const isPlanningTrip = activeTripId === 'penang';
  const isHostView = viewerRole === 'host';
  const activeStops = activeTripId === 'tokyo' ? stops : isPlanningTrip ? planningStops[selectedDay] : ALT_STOPS;
  const planningLabel = planningStage === 'planning' ? 'Planning' : planningStage === 'review' ? 'Group review' : planningStage === 'accommodation' ? 'Choose stay' : 'Confirmed';
  const dayTabs = isPlanningTrip
    ? [{ id: 'day1', label: 'Day 1 • Jun 7', desc: 'George Town' }, { id: 'day2', label: 'Day 2 • Jun 8', desc: 'Waterfront & food' }, { id: 'day3', label: 'Day 3 • Jun 9', desc: 'Gardens & Gurney' }]
    : [{ id: 'day1', label: 'Day 1 • May 12', desc: 'Harajuku & Shibuya' }, { id: 'day2', label: 'Day 2 • May 13', desc: 'Asakusa & Ginza' }, { id: 'day3', label: 'Day 3 • May 14', desc: 'Toyosu & Odaiba' }];
  const groupInputCount = Object.keys(comments).length + Object.keys(changeRequests).length;
  const selectedInputStop = activeStops.find(stop => stop.id === selectedInputStopId);
  const inputCountForStop = (stopId: string) => Number(Boolean(comments[stopId])) + Number(Boolean(changeRequests[stopId]));
  const handlePlanningAction = (stopId: string, action: 'keep' | 'remove' | 'replace') => {
    switch (action) {
      case 'remove':
        setPlanningStops(current => ({ ...current, [selectedDay]: current[selectedDay].filter(stop => stop.id !== stopId) }));
        return;
      case 'replace':
        setPlanningStops(current => ({ ...current, [selectedDay]: current[selectedDay].map(stop => stop.id === stopId ? {
          ...stop,
          title: stop.id === 'alt-1' ? 'New Lane Hawker Centre' : stop.id === 'alt-2' ? 'Penang Peranakan Mansion' : 'Accessible local alternative',
          subtitle: 'Suggested accessible alternative',
          wayloRationale: 'This alternative keeps the day lower-effort while preserving the group’s interests.',
        } : stop) }));
        return;
      case 'keep':
        return;
    }
  };
  const proposeAdjustment = () => {
    const request = adjustmentRequest.toLowerCase();
    const changes = [request.includes('rest') || request.includes('fatigue') ? 'add a 20-minute quiet café rest' : '', request.includes('eat') || request.includes('food') ? 'add a nearby step-free food option' : ''].filter(Boolean);
    setWayloProposal(changes.length ? `Waylo suggests we ${changes.join(' and ')} on this day. The route and accessibility rules remain protected.` : 'Waylo suggests a shorter transfer and one flexible rest stop on this day. The route and accessibility rules remain protected.');
  };
  const applyAdjustment = () => {
    const request = adjustmentRequest.toLowerCase();
    setPlanningStops(current => ({ ...current, [selectedDay]: [...current[selectedDay], ...(request.includes('rest') || request.includes('fatigue') ? [{ id: `rest-${selectedDay}`, time: '11:45', tag: 'REST BREAK', title: 'Quiet café rest', subtitle: '20-minute low-sensory pause', features: ['Step-free entry', 'Accessible restroom nearby'], badges: [{ label: 'ADDED BY WAYLO', type: 'green' as const }], votes: 0 }] : []), ...(request.includes('eat') || request.includes('food') ? [{ id: `food-${selectedDay}`, time: '13:15', tag: 'FOOD', title: 'Accessible local food stop', subtitle: 'Flexible group lunch option', features: ['Step-free seating', 'Dietary options available'], badges: [{ label: 'ADDED BY WAYLO', type: 'green' as const }], votes: 0 }] : [])] }));
    setWayloProposal(null);
    setAdjustmentRequest('');
  };
  const submitComment = (stopId: string) => {
    if (!commentText.trim()) return;
    setComments(current => ({ ...current, [stopId]: commentText.trim() }));
    setCommentText('');
    setCommentStopId(null);
  };

  if (viewMode === 'overview') {
    return <div className="flex-1 w-full max-w-md mx-auto p-4 space-y-4 pb-24">
      <div className="flex items-start justify-between"><div><p className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-[#aa2f1f]">Your travel plans</p><h1 className="mt-1 text-[22px] font-extrabold tracking-tight text-stone-900">My itineraries</h1><p className="mt-1 text-[12px] font-medium text-stone-500">Choose a trip to view its day-by-day schedule.</p></div><button type="button" onClick={onCreateTrip} className="flex h-10 w-10 items-center justify-center rounded-full bg-[#fff0ec] text-[#aa2f1f]" title="Create a new trip"><span className="material-symbols-outlined">add</span></button></div>
      <div className="space-y-3">{TRIPS.map((trip, index) => <button key={trip.id} onClick={() => { onTripChange(trip.id); setSelectedDay('day1'); setViewMode('details'); }} className="w-full overflow-hidden rounded-2xl border border-[#eadeda] bg-white text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md active:scale-[0.99]"><div className={`h-2 ${index === 0 ? 'bg-[#aa2f1f]' : index === 1 ? 'bg-[#d6a510]' : 'bg-[#006c51]'}`} /><div className="p-4"><div className="flex items-start justify-between gap-3"><div><p className="text-[16px] font-extrabold tracking-tight text-stone-900">{trip.name}</p><p className="mt-1 text-[12px] font-semibold text-stone-500">{trip.dates} • {trip.id === 'tokyo' ? '7 days' : trip.id === 'penang' ? '3 days' : '4 days'}</p></div><span className={`rounded-full px-2.5 py-1 text-[10px] font-extrabold ${trip.statusClass}`}>{trip.status}</span></div><div className="mt-4 flex items-center justify-between border-t border-[#eee5e1] pt-3"><span className="text-[11px] font-medium text-stone-600">{trip.id === 'tokyo' ? '4 travelers • 5 bookings saved' : trip.id === 'penang' ? '3 travelers • review in progress' : '2 travelers • ready for confirmation'}</span><span className="flex items-center gap-1 text-[12px] font-extrabold text-[#aa2f1f]">View schedule <span className="material-symbols-outlined text-[16px]">arrow_forward</span></span></div></div></button>)}</div>
    </div>;
  }

  return (
    <div className="flex-1 w-full max-w-md mx-auto p-4 space-y-4 pb-20">
      {/* Header */}
       <div className="flex items-center justify-between">
         <div className="flex items-center gap-2">
           <button onClick={() => setViewMode('overview')} className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f3ede9] text-stone-700"><span className="material-symbols-outlined">arrow_back</span></button>
           <div>
           <h1 className="font-extrabold text-[17px] text-stone-900 tracking-tight">{selectedTrip.name}</h1>
           <span className="text-[11px] text-stone-500 font-medium">{selectedTrip.subtitle}</span>
           </div>
         </div>
         <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${isPlanningTrip && planningStage === 'confirmed' ? 'bg-[#dffbed] text-[#006c51]' : selectedTrip.statusClass}`}>
           <span className="material-symbols-outlined text-[15px]">{isPlanningTrip ? planningStage === 'confirmed' ? 'verified' : 'edit_note' : selectedTrip.status === 'Confirmed' ? 'verified' : 'edit_note'}</span>
           <span>{isPlanningTrip ? planningLabel : selectedTrip.status}</span>
         </div>
       </div>

      {/* Day Selector Tabs */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
        {dayTabs.map(day => (
          <button
            key={day.id}
            onClick={() => setSelectedDay(day.id as any)}
            className={`px-3 py-2 rounded-2xl text-left border flex-shrink-0 transition active:scale-95 ${
              selectedDay === day.id
                ? 'bg-[#eb5e49] text-white border-[#eb5e49] shadow-sm'
                : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
            }`}
          >
            <div className="text-xs font-extrabold">{day.label}</div>
            <div className={`text-[9px] ${selectedDay === day.id ? 'text-white/80' : 'text-stone-400'}`}>
              {day.desc}
            </div>
          </button>
        ))}
      </div>

      {isPlanningTrip && <section className="rounded-2xl border border-[#eadeda] bg-white p-4"><div className="flex items-start gap-3"><div className="flex h-[76px] w-[76px] shrink-0 items-center justify-center rounded-xl bg-[#f8f2ef]"><span className="material-symbols-outlined text-[62px] leading-none text-stone-900">qr_code_2</span></div><div className="min-w-0 flex-1"><p className="text-[10px] font-extrabold uppercase tracking-wide text-[#006c51]">Invite your group</p><p className="mt-1 text-[13px] font-extrabold text-stone-900">Join: Penang Food Weekend</p><p className="mt-1 text-[11px] font-medium leading-relaxed text-stone-500">Share to invite travelers.</p><p className="mt-2 text-[10px] font-extrabold text-[#aa2f1f]">Invite code: PENANG-26</p></div></div><div className="mt-3 flex items-center justify-between border-t border-[#eee5e1] pt-3"><span className="text-[11px] font-semibold text-stone-600">1 of {planningTravelerCount} profiles complete</span><button type="button" onClick={() => navigator.clipboard?.writeText('PENANG-26')} className="rounded-full bg-[#fff0ec] px-3 py-1.5 text-[10px] font-extrabold text-[#aa2f1f]">Copy invite code</button></div></section>}

      {isPlanningTrip && planningStage === 'planning' && isHostView && <button onClick={() => setPlanningStage('review')} className="w-full rounded-full bg-[#aa2f1f] py-3 text-[12px] font-extrabold text-white shadow-sm">Request group review</button>}

      {isPlanningTrip && planningStage !== 'confirmed' && planningStage !== 'planning' && <section className="rounded-2xl border border-[#eadeda] bg-white p-4">
        <div><p className="text-[10px] font-extrabold uppercase tracking-wide text-[#aa2f1f]">Trip status</p><p className="mt-1 text-[14px] font-extrabold text-stone-900">{planningLabel}</p></div>
        {isHostView && groupInputCount > 0 && <p className="mt-2 text-[11px] font-extrabold text-[#006c51]">{groupInputCount} group input{groupInputCount === 1 ? '' : 's'} to review in the itinerary below</p>}
        {planningStage === 'review' && <><p className="mt-2 text-[12px] font-medium leading-relaxed text-stone-600">3 of 4 travelers responded. The trip lead can proceed now</p><button onClick={() => setPlanningStage('accommodation')} className="mt-3 w-full rounded-full bg-[#aa2f1f] py-2.5 text-[12px] font-extrabold text-white">Confirm itinerary</button></>}
        {planningStage === 'accommodation' && <div className="mt-3 space-y-2"><p className="text-[12px] font-medium leading-relaxed text-stone-600">Choose a stay to confirm your trip.</p>{[['Georgetown accessible suite', 'Near the Day 1 route • accessible-room request'], ['Gurney Drive step-free hotel', 'Elevator access • quiet-room request']].map(([name, detail]) => <button key={name} onClick={() => setSelectedStay(name)} className={`w-full rounded-xl border p-3 text-left ${selectedStay === name ? 'border-[#006c51] bg-[#edfbf7]' : 'border-[#eadeda]'}`}><p className="text-[12px] font-extrabold text-stone-900">{name}</p><p className="mt-0.5 text-[11px] font-medium text-stone-500">{detail}</p></button>)}<button disabled={!selectedStay} onClick={() => setPlanningStage('confirmed')} className={`w-full rounded-full py-2.5 text-[12px] font-extrabold ${selectedStay ? 'bg-[#006c51] text-white' : 'bg-stone-200 text-stone-500'}`}>{selectedStay ? 'Confirm trip' : 'Choose a stay to confirm trip'}</button></div>}
      </section>}

      {isPlanningTrip && planningStage === 'planning' && <section className="rounded-2xl border border-[#d8e9e2] bg-[#f5fcf8] p-4"><div className="flex items-center gap-2"><span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#006c51] text-[11px] font-black text-white">W</span><div><p className="text-[12px] font-extrabold text-stone-900">Ask Waylo to adjust this day</p><p className="text-[10px] font-medium text-stone-500">Waylo will propose changes before applying them.</p></div></div><div className="mt-3 flex gap-2 overflow-x-auto pb-1">{['Add more rest', 'Add food options', 'Make it lower-fatigue'].map((request) => <button key={request} type="button" onClick={() => setAdjustmentRequest(request)} className="shrink-0 rounded-full border border-[#b8e8d4] bg-white px-3 py-1.5 text-[10px] font-extrabold text-[#006c51]">{request}</button>)}</div><div className="mt-3 flex gap-2"><input value={adjustmentRequest} onChange={(event) => setAdjustmentRequest(event.target.value)} placeholder="e.g. Add a café break and more food choices" className="min-w-0 flex-1 rounded-xl border border-[#cfe3da] bg-white px-3 py-2 text-[11px] font-medium outline-none focus:border-[#006c51]" /><button type="button" onClick={proposeAdjustment} disabled={!adjustmentRequest.trim()} className={`rounded-xl px-3 text-[11px] font-extrabold ${adjustmentRequest.trim() ? 'bg-[#006c51] text-white' : 'bg-stone-200 text-stone-500'}`}>Ask</button></div>{wayloProposal && <div className="mt-3 rounded-xl border border-[#b8e8d4] bg-white p-3"><div className="flex items-center gap-2"><div className="h-9 w-9 shrink-0 overflow-hidden rounded-xl bg-[#ffe4dc]"><img src={wayloMascot} alt="Waylo" className="h-11 max-w-none object-contain" /></div><p className="text-[10px] font-extrabold uppercase tracking-wide text-[#006c51]">Waylo’s proposed adjustment</p></div><p className="mt-2 text-[11px] font-semibold leading-relaxed text-stone-700">{wayloProposal}</p><div className="mt-3 flex gap-2"><button type="button" onClick={isHostView ? applyAdjustment : () => setWayloProposal(null)} className="rounded-full bg-[#aa2f1f] px-3 py-1.5 text-[10px] font-extrabold text-white">{isHostView ? 'Apply changes' : 'Send to host'}</button><button type="button" onClick={() => setWayloProposal(null)} className="rounded-full border border-[#d9ccc7] px-3 py-1.5 text-[10px] font-extrabold text-stone-700">Keep current plan</button></div></div>}</section>}

      {/* Timeline List of Stops */}
      <div className="space-y-3 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-stone-200 before:z-0">
         {activeStops.map((stop) => (
          <div key={stop.id} className="relative z-10 pl-7 space-y-2">
            {/* Timeline Dot Indicator */}
            <div className={`absolute left-2 top-3 -translate-x-1/2 w-3.5 h-3.5 rounded-full ring-4 ring-[#fef8f4] ${
              stop.isMustDo ? 'bg-[#eb5e49]' : 'bg-[#006c51]'
            }`}></div>

            <div className="bg-white rounded-3xl p-4 border border-stone-200 shadow-xs space-y-2.5 transition hover:border-[#eb5e49]/40">
              {/* Tag & Time */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-bold text-[#eb5e49] bg-[#fff1ef] px-2 py-0.5 rounded-full border border-[#ffe4e0]">
                    {stop.tag}
                  </span>
                  {stop.isMustDo && (
                    <span className="text-[9px] font-black text-white bg-stone-900 px-2 py-0.5 rounded-full">
                      MUST-DO LOCK
                    </span>
                  )}
                </div>
                <span className="text-xs font-extrabold text-stone-900">{stop.time}</span>
              </div>

              {/* Title & Subtitle */}
              <div>
                <h3 className="text-sm font-extrabold text-stone-900 leading-snug">{stop.title}</h3>
                <p className="text-xs text-stone-500 mt-0.5 font-medium">{stop.subtitle}</p>
              </div>

              {/* Photo if present */}
              {stop.imageUrl && (
                <div className="relative rounded-2xl overflow-hidden h-32 w-full border border-stone-100 shadow-xs">
                  <img
                    src={stop.imageUrl}
                    alt={stop.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-xs text-white text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                    <span className="material-symbols-outlined text-[12px]">accessible_forward</span>
                    <span>Boardwalk Route Verified</span>
                  </div>
                </div>
              )}

              {/* Features Bullet */}
              <div className="text-[11px] text-stone-600 space-y-0.5">
                {stop.features.map((feat, i) => (
                  <div key={i} className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#006c51]"></span>
                    <span>{feat}</span>
                  </div>
                ))}
              </div>

              {/* Badges */}
              <div className="flex items-center gap-1.5 flex-wrap pt-1 border-t border-stone-100">
                {stop.badges.map((badge, i) => {
                  const colorMap = {
                    red: 'bg-[#fff1ef] text-[#eb5e49] border-[#ffe4e0]',
                    green: 'bg-[#edfbf7] text-[#006c51] border-[#daf7ef]',
                    yellow: 'bg-amber-50 text-amber-800 border-amber-200',
                    neutral: 'bg-stone-100 text-stone-700 border-stone-200',
                  };
                  return (
                    <span
                      key={i}
                      className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full border ${colorMap[badge.type]}`}
                    >
                      {badge.label}
                    </span>
                  );
                })}
              </div>

              {isPlanningTrip && planningStage === 'planning' && (isHostView ? <div className="flex gap-2 border-t border-stone-100 pt-2"><button type="button" onClick={() => handlePlanningAction(stop.id, 'replace')} className="rounded-full border border-[#d9ccc7] px-3 py-1.5 text-[10px] font-extrabold text-stone-700">Replace</button><button type="button" onClick={() => handlePlanningAction(stop.id, 'remove')} className="rounded-full border border-[#ffd6cf] bg-[#fff6f3] px-3 py-1.5 text-[10px] font-extrabold text-[#aa2f1f]">Remove</button></div> : <div className="border-t border-stone-100 pt-2"><div className="flex flex-wrap gap-2"><button type="button" onClick={() => setCommentStopId(stop.id)} className="rounded-full border border-[#b8e8d4] bg-[#edfbf7] px-3 py-1.5 text-[10px] font-extrabold text-[#006c51]">Comment</button><button type="button" onClick={() => setChangeRequests(current => ({ ...current, [stop.id]: 'replace' }))} className="rounded-full border border-[#d9ccc7] px-3 py-1.5 text-[10px] font-extrabold text-stone-700">Request replace</button><button type="button" onClick={() => setChangeRequests(current => ({ ...current, [stop.id]: 'remove' }))} className="rounded-full border border-[#ffd6cf] bg-[#fff6f3] px-3 py-1.5 text-[10px] font-extrabold text-[#aa2f1f]">Request removal</button></div>{commentStopId === stop.id && <div className="mt-2 flex gap-2"><input autoFocus value={commentText} onChange={(event) => setCommentText(event.target.value)} placeholder="Add a note for the host…" className="min-w-0 flex-1 rounded-xl border border-[#d9ccc7] px-3 py-2 text-[11px] outline-none" /><button type="button" onClick={() => submitComment(stop.id)} className="rounded-xl bg-[#006c51] px-3 text-[10px] font-extrabold text-white">Send</button></div>}{comments[stop.id] && <p className="mt-2 rounded-lg bg-[#f8f2ef] px-2.5 py-2 text-[10px] font-medium text-stone-600">Your comment: {comments[stop.id]}</p>}{changeRequests[stop.id] && <p className="mt-2 text-[10px] font-extrabold text-[#aa2f1f]">{changeRequests[stop.id] === 'replace' ? 'Replacement' : 'Removal'} request sent to host</p>}</div>)}
              {isPlanningTrip && inputCountForStop(stop.id) > 0 && <div className="flex items-center justify-between border-t border-stone-100 pt-2"><span className="text-[10px] font-extrabold text-[#006c51]">{inputCountForStop(stop.id)} group input{inputCountForStop(stop.id) === 1 ? '' : 's'}</span><button type="button" onClick={() => setSelectedInputStopId(stop.id)} className="rounded-full border border-[#b8e8d4] bg-[#edfbf7] px-3 py-1.5 text-[10px] font-extrabold text-[#006c51]">View</button></div>}
            </div>
          </div>
        ))}
      </div>
      {selectedInputStop && <div className="fixed inset-0 z-[70] flex items-end bg-stone-900/30 md:left-1/2 md:w-[448px] md:-translate-x-1/2" onClick={() => setSelectedInputStopId(null)}><section className="w-full rounded-t-[28px] bg-[#fef8f4] p-5 shadow-[0_-12px_36px_rgba(38,27,23,0.24)]" onClick={(event) => event.stopPropagation()}><div className="mx-auto h-1.5 w-11 rounded-full bg-stone-300" /><div className="mt-4 flex items-start justify-between gap-3"><div><p className="text-[10px] font-extrabold uppercase tracking-wide text-[#006c51]">Group input</p><h2 className="mt-1 text-[17px] font-extrabold text-stone-900">{selectedInputStop.title}</h2></div><button type="button" onClick={() => setSelectedInputStopId(null)} className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f3ede9] text-stone-600"><span className="material-symbols-outlined text-[18px]">close</span></button></div><div className="mt-4 space-y-2">{comments[selectedInputStop.id] && <div className="rounded-xl border border-[#e6ddd8] bg-white p-3"><p className="text-[10px] font-extrabold text-[#006c51]">MEI COMMENTED</p><p className="mt-1 text-[12px] font-medium text-stone-700">{comments[selectedInputStop.id]}</p></div>}{changeRequests[selectedInputStop.id] && <div className="rounded-xl border border-[#ffd6cf] bg-[#fff6f3] p-3"><p className="text-[10px] font-extrabold text-[#aa2f1f]">CHANGE REQUEST</p><p className="mt-1 text-[12px] font-medium text-stone-700">Requested: {changeRequests[selectedInputStop.id] === 'replace' ? 'Replace this stop' : 'Remove this stop'}</p></div>}</div>{isHostView && planningStage === 'planning' && <div className="mt-4 flex gap-2"><button type="button" onClick={() => { handlePlanningAction(selectedInputStop.id, 'replace'); setSelectedInputStopId(null); }} className="flex-1 rounded-full border border-[#d9ccc7] py-2.5 text-[11px] font-extrabold text-stone-700">Replace</button><button type="button" onClick={() => { handlePlanningAction(selectedInputStop.id, 'remove'); setSelectedInputStopId(null); }} className="flex-1 rounded-full bg-[#aa2f1f] py-2.5 text-[11px] font-extrabold text-white">Remove</button></div>}</section></div>}
    </div>
  );
};
