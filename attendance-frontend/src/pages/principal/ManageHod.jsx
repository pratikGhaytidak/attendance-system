// import React from 'react'

// function ManageHod() {
//   return (
//     <div>ManageHod</div>
//   )
// }

// export default ManageHod

import React, { useEffect, useState } from "react";
import "./ManageHod.css";

function ManageHod() {
  const [hods, setHods] = useState([]);

  useEffect(() => {
    fetch("http://localhost/attendance-system/attendance-backend/api/principal/getHods.php")
      .then((res) => res.json())
      .then((data) => {
        setHods(data);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className="principal-container">
      <h2 className="title">HOD List</h2>

      <table className="hod-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Department ID</th>
          </tr>
        </thead>

        <tbody>
          {hods.length > 0 ? (
            hods.map((hod) => (
              <tr key={hod.id}>
                <td>{hod.id}</td>
                <td>{hod.name}</td>
                <td>{hod.email}</td>
                <td>{hod.department_id}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">No HODs found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default ManageHod;