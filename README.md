# CampusFix 🛠️

CampusFix is a mobile-based campus complaint management system designed to make reporting, tracking, assigning, and resolving student complaints more efficient and transparent.

The application provides dedicated workflows for **Students, Technicians, and Wardens**, allowing complaints to be managed throughout their lifecycle.

## ✨ Features

### 👨‍🎓 Student
- Report campus issues
- Select complaint category and priority
- Add hostel and room details
- Upload images as supporting evidence
- Track complaint status
- View complaint history
- Add comments to complaints
- Detect similar active complaints before submitting a new one

### 🔧 Technician
- View assigned complaints
- Manage task queue
- Update complaint status
- Add resolution notes
- Upload resolution images
- View technician profile

### 🧑‍💼 Warden
- View campus complaint dashboard
- Monitor all complaints
- Filter complaints by category and status
- Assign technicians
- Override complaint priority when required
- Monitor complaint analytics
- Manage technician/staff information

## 🔍 Duplicate Complaint Detection

CampusFix helps prevent duplicate complaints from being submitted by identifying potentially similar active complaints.

A complaint is considered a possible duplicate when it matches:

- Hostel block
- Room number
- Complaint category
- Similar title/description

Only active complaints are considered:

- `REPORTED`
- `ASSIGNED`
- `IN_PROGRESS`

Resolved complaints do not prevent students from reporting the issue again.

Students are given the option to:

- View the existing complaint
- Report a different issue
- Cancel submission

## 🛠️ Tech Stack

### Frontend
- React Native
- Expo
- TypeScript
- React Navigation

### Development Tools
- Git
- GitHub
- VS Code
- Android Emulator

### Backend
The current application uses a mock API/service layer for development and demonstration.

Future versions can integrate a production backend with authentication, database persistence, and real-time updates.

## 📁 Project Structure

```text
CampusFix/
├── App.tsx
├── app.json
├── package.json
├── package-lock.json
│
└── src/
    ├── context/
    │   ├── AuthContext.tsx
    │   └── ComplaintsContext.tsx
    │
    ├── navigation/
    │   ├── RootNavigator.tsx
    │   ├── StudentNavigator.tsx
    │   ├── TechnicianNavigator.tsx
    │   └── WardenNavigator.tsx
    │
    ├── screens/
    │   ├── auth/
    │   ├── student/
    │   ├── technician/
    │   └── warden/
    │
    ├── services/
    │   └── mockApi.ts
    │
    ├── types.ts
    └── theme.tsx