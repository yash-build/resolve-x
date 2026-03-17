function ProfilePanel({profile}){

return(

<div className="bg-white p-6 rounded-xl shadow">

<h2 className="font-semibold mb-4">
Student Profile
</h2>

{profile && (

<div className="space-y-2">

<p><b>Name:</b> {profile.name}</p>
<p><b>Email:</b> {profile.email}</p>
<p><b>Role:</b> {profile.role}</p>

</div>

)}

</div>

);

}

export default ProfilePanel;