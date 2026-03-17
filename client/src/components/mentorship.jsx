import { useState } from "react";

const mentors = [
{
id:1,
name:"Dr. Sarah Mwangi",
field:"Civil Engineering",
experience:"10 years",
bio:"Structural engineer passionate about mentoring young women in STEM.",
image:"https://randomuser.me/api/portraits/women/44.jpg"
},

{
id:2,
name:"Linda Okoth",
field:"Software Engineering",
experience:"7 years",
bio:"Frontend developer helping girls break into tech.",
image:"https://randomuser.me/api/portraits/women/65.jpg"
},

{
id:3,
name:"Grace Achieng",
field:"Entrepreneurship",
experience:"12 years",
bio:"Founder supporting women-led startups.",
image:"https://randomuser.me/api/portraits/women/32.jpg"
},

{
id:4,
name:"Faith Njeri",
field:"Leadership & Mental Health",
experience:"8 years",
bio:"Coach helping young women grow personally and professionally.",
image:"https://randomuser.me/api/portraits/women/12.jpg"
}
];

function Mentorship(){

const [selectedMentor,setSelectedMentor] = useState(null);
const [sessionDate,setSessionDate] = useState("");

const bookSession=(mentor)=>{
setSelectedMentor(mentor);
};

const confirmBooking=()=>{
alert(`Session booked with ${selectedMentor.name} on ${sessionDate}`);
};

return(

<div className="space-y-8">

<h2 className="text-xl font-semibold text-slate-100">
Mentorship
</h2>

<p className="text-sm text-slate-400">
Connect with experienced women mentors who can guide your journey.
</p>

<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

{mentors.map((mentor)=>(
<div
key={mentor.id}
className="bg-slate-800 border border-slate-700 rounded-xl p-5 shadow-lg hover:shadow-xl transition"
>

<img
src={mentor.image}
alt={mentor.name}
className="w-20 h-20 rounded-full mx-auto mb-3 object-cover"
/>

<h3 className="text-lg font-semibold text-center text-white">
{mentor.name}
</h3>

<p className="text-center text-emerald-400 text-sm">
{mentor.field}
</p>

<p className="text-center text-xs text-slate-400">
Experience: {mentor.experience}
</p>

<p className="text-sm text-slate-300 mt-3 text-center">
{mentor.bio}
</p>

<button
onClick={()=>bookSession(mentor)}
className="mt-4 w-full py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white shadow-md transition"
>
Book Mentorship
</button>

</div>
))}

</div>

{selectedMentor && (

<div className="bg-slate-900 border border-slate-700 rounded-xl p-6 space-y-4">

<h3 className="text-lg font-semibold text-white">
Book Session with {selectedMentor.name}
</h3>

<input
type="date"
value={sessionDate}
onChange={(e)=>setSessionDate(e.target.value)}
className="w-full p-2 rounded bg-slate-800 border border-slate-600"
/>

<button
onClick={confirmBooking}
className="w-full py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white shadow"
>
Confirm Booking
</button>

<p className="text-xs text-slate-400">
A video meeting link (Zoom or Google Meet) will be sent after booking.
</p>

</div>

)}

<div className="bg-slate-800 border border-slate-700 rounded-xl p-6">

<h3 className="text-lg font-semibold text-white">
AI Mentor Suggestion
</h3>

<p className="text-sm text-slate-400 mt-2">
Based on your interests, we recommend mentors in Engineering and Technology fields.
</p>

<button className="mt-3 px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg text-white shadow">
Get AI Match
</button>

</div>

</div>

);
}

export default Mentorship;