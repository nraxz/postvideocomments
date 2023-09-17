import React, { useState } from 'react';
import supabase from "../config/supabaseClient";
import { useNavigate } from "react-router-dom";


const CreatePage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    details: '',
    image: '',
    status: 'Inactive',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      // Insert the form data into the "stories" table
      const { data, error } = await supabase.from('stories').insert([formData]);
  
      if (error) {
        throw error;
      }
  
      // Handle successful submission
      console.log('Data submitted successfully:', data);
      navigate("/");
    } catch (error) {
      // Handle errors
      console.error('Error submitting data:', error.message);
    }
  };

  return (
    <div className="container">
      <h1>Create Page</h1>
      <form onSubmit={handleSubmit} className="needs-validation" noValidate>
        <div className="form-group">
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            className="form-control"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="details">Details:</label>
          <textarea
            className="form-control"
            id="details"
            name="details"
            value={formData.details}
            onChange={handleInputChange}
            rows="4"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="image">Image URL:</label>
          <textarea
            className="form-control"
            id="image"
            name="image"
            value={formData.image}
            onChange={handleInputChange}
            rows="4"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="status">Status:</label>
          <input
            type="text"
            className="form-control"
            id="status"
            name="status"
            value={formData.status}
            onChange={handleInputChange}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">Create</button>
      </form>
    </div>
  );
};
export default CreatePage;
