const BASE_URL = 'http://localhost:5000/api';

const disasterForm = document.getElementById('disasterForm');
const resourceForm = document.getElementById('resourceForm');
const disasterList = document.getElementById('disasterList');
const resourceList = document.getElementById('resourceList');
const socialList = document.getElementById('socialList');

// Submit new disaster
disasterForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const title = document.getElementById('title').value;
  const location_name = document.getElementById('location_name').value;
  const description = document.getElementById('description').value;

  const disaster = {
    title,
    location_name,
    description,
    tags: ['frontend'],
    owner_id: 'user123'
  };

  try {
    const res = await fetch(`${BASE_URL}/disasters`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(disaster)
    });

    if (res.ok) {
      alert('Disaster reported!');
      e.target.reset();
      fetchDisasters();
    } else {
      alert('Error reporting disaster.');
    }
  } catch (err) {
    console.error(err);
  }
});

// Fetch reported disasters
async function fetchDisasters() {
  const res = await fetch(`${BASE_URL}/disasters`);
  const data = await res.json();
  disasterList.innerHTML = '';

  data.forEach((d) => {
    const li = document.createElement('li');
    li.innerHTML = `
      <strong>${d.title}</strong> - ${d.location_name}<br />
      ${d.description}<br />
      <button onclick="editDisaster('${d.id}', '${d.title}', '${d.location_name}', \`${d.description}\`)">Update</button>
      <button onclick="deleteDisaster('${d.id}')">Delete</button>
    `;
    disasterList.appendChild(li);
  });
}

// Delete disaster
async function deleteDisaster(id) {
  if (!confirm('Are you sure you want to delete this disaster?')) return;

  try {
    const res = await fetch(`${BASE_URL}/disasters/${id}`, {
      method: 'DELETE',
    });

    if (res.ok) {
      alert('Disaster deleted!');
      fetchDisasters();
    } else {
      alert('Failed to delete disaster.');
    }
  } catch (err) {
    console.error('Delete error:', err);
  }
}

// Edit disaster (prefills form)
function editDisaster(id, title, location_name, description) {
  document.getElementById('title').value = title;
  document.getElementById('location_name').value = location_name;
  document.getElementById('description').value = description;

  const form = document.getElementById('disasterForm');
  form.querySelector('button').textContent = 'Update Report';

  form.onsubmit = async function (e) {
    e.preventDefault();
    const updated = {
      title: document.getElementById('title').value,
      location_name: document.getElementById('location_name').value,
      description: document.getElementById('description').value,
    };

    try {
      const res = await fetch(`${BASE_URL}/disasters/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      });

      if (res.ok) {
        alert('Disaster updated!');
        form.reset();
        form.querySelector('button').textContent = 'Submit Report';
        form.onsubmit = defaultSubmitHandler;
        fetchDisasters();
      } else {
        alert('Failed to update disaster.');
      }
    } catch (err) {
      console.error('Update error:', err);
    }
  };
}

// Store original submit handler
const defaultSubmitHandler = disasterForm.onsubmit;

// Fetch social media alerts
async function fetchSocialMediaAlerts(disasterId = 'default') {
  try {
    const res = await fetch(`${BASE_URL}/social-media/${disasterId}`);
    const data = await res.json();
    socialList.innerHTML = '';

    data.forEach((item) => {
      const li = document.createElement('li');
      li.innerHTML = `<strong>@${item.user}</strong>: ${item.post}`;
      socialList.appendChild(li);
    });
  } catch (err) {
    console.error('Error fetching social media alerts:', err);
  }
}

// Fetch nearby resources
resourceForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const lat = document.getElementById('lat').value;
  const lon = document.getElementById('lon').value;

  try {
    const res = await fetch(`${BASE_URL}/resources?lat=${lat}&lon=${lon}`);
    const result = await res.json();

    resourceList.innerHTML = '';

    if (result.error || !result.data || result.data.length === 0) {
      resourceList.innerHTML = '<li>No resources found near this location.</li>';
      return;
    }

    result.data.forEach((resource) => {
      const li = document.createElement('li');
      li.innerHTML = `
        <strong>${resource.name || 'Unnamed Resource'}</strong><br/>
        ${resource.description || 'No description'}<br/>
        <em>Distance: ${resource.distance?.toFixed(2)} km</em>
      `;
      resourceList.appendChild(li);
    });
  } catch (err) {
    console.error('Error fetching resources:', err);
  }
});

// Toggle sections (only one visible at a time)
document.querySelectorAll('.sidebar nav a').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();

    const targetId = link.getAttribute('href').substring(1);

    document.querySelectorAll('main > section').forEach(section => {
      section.classList.remove('active-section');
    });

    const targetSection = document.getElementById(targetId);
    if (targetSection) {
      targetSection.classList.add('active-section');
    }
  });
});

// Initial Load
window.addEventListener('DOMContentLoaded', () => {
  fetchDisasters();
  fetchSocialMediaAlerts();

  // Show only the first section by default
  const firstSection = document.querySelector('main > section');
  if (firstSection) {
    firstSection.classList.add('active-section');
  }
});
