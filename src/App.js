import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [projects, setProjects] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  useEffect(() => {
    async function fetchProjects() {
      try {
        const response = await fetch(
          "https://raw.githubusercontent.com/saaslabsco/frontend-assignment/refs/heads/master/frontend-assignment.json"
        );
        const data = await response.json();
        setProjects(data);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    }
    fetchProjects();
  }, []);

  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentProjects = projects.slice(startIndex, startIndex + rowsPerPage);

  const handleNext = () => {
    if (currentPage < Math.ceil(projects.length / rowsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrev = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="app">
      <h1>Highly-Rated Kickstarter Projects</h1>
      <table>
        <thead>
          <tr>
            <th>S.No.</th>
            <th>Percentage Funded</th>
            <th>Amount Pledged</th>
          </tr>
        </thead>
        <tbody>
          {currentProjects.map((project, index) => (
            <tr key={project["s.no"]}>
              <td>{startIndex + index + 1}</td>
              <td>{project["percentage.funded"]}%</td>
              <td>${project["amt.pledged"]}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination">
        <button onClick={handlePrev} disabled={currentPage === 1}>
          Previous
        </button>
        <button
          onClick={handleNext}
          disabled={currentPage === Math.ceil(projects.length / rowsPerPage)}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default App;
