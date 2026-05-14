function TaskFilter({ options, value, onChange }) {
  return (
    <div className="filter-row">
      <label>
        Filter by status
        <select value={value} onChange={(event) => onChange(event.target.value)}>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}

export default TaskFilter;
