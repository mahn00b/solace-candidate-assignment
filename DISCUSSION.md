# Solace Candidate Response


<details>
<summary>Foreword</summary>

I recognize that I invested more time in this exercise than was strictly required. I took those extra steps for two reasons.

**First**, I enjoyed learning Drizzle. It's one of the more pleasant ORMs I've used, so I spent time exploring its patterns and capabilities to broaden my skills. I appreciate its design and can see why it is gaining traction.

**Second**, I enhanced the seeder because I thought those improvements might be useful for future take-home projects. My goal was to produce realistic, varied test data that makes the application easier to evaluate and to exercise the solution's scalability.

</details>


## Description

This is my submission for the Solace software engineering interview.

I modeled the UX to mirror the real-world experience of a user searching for a healthcare advocate.

The primary enhancement to the interface is a guided onboarding flow. Users begin by selecting their health concerns and location, ensuring a search that is fine-tuned to their needs. Once results are populated, users can further refine their search by filtering for education level and years of experience, or by searching for specific advocates by name.

Below, I have detailed a summary of the changes made across the application.

## Summary of Changes

### Data Model
My goal was to simulate a production-grade environment.

While the initial mock data was sufficient for a prototype, I chose to normalize the database schema to demonstrate scalable system design. By splitting the data model into distinct entities, I was able to implement more efficient database queries and better represent the relationships between advocates and their specializations.

### Seeder

I leveraged the Drizzle team's `drizzle-seed` package to auto-generate mock data for advocates and health concerns.

However, I needed to write a custom solution for `advocate_specialties` due to limitations in the library. The standard tools did not support generating randomized one-to-many relationships using existing database rows—a critical requirement for linking advocates to the pre-defined set of specializations. My custom script bridges this gap, ensuring realistic and consistent data relationships.

### API

I implemented new endpoints to support the onboarding flow and dynamic filtering:

- `GET /api/health-concerns`: Populates the initial selection screen with available health concerns.
- `GET /api/cities`: Retrieves a list of cities from the seeded database to power the location autocomplete.
- `GET /api/advocates`: Handles the core search logic, filtering advocates by city, health concerns, and name.

I structured the API to be RESTful and focused on providing exactly the data the frontend needs to render the onboarding steps efficiently.

### Frontend

My goal was to craft an onboarding experience that felt professional and realistic. Given my extensive React experience, I leveraged [v0](https://v0.dev) to accelerate the initial UI generation. I am comfortable using AI-assisted tools because I can confidently review, explain, and refactor the generated code.

While v0 provided a strong foundation, I significantly refined the implementation. I optimized component architecture to minimize re-renders, removed unnecessary bloat, and polished the styling to ensure a cohesive look and feel. I also implemented custom interactions to ensure the user flow was intuitive and responsive.

## Conclusion

I approached this assignment as an opportunity to demonstrate a wide range of full-stack skills. While there are additional features I would have liked to build, I had to draw a line to respect the scope of the exercise. That said, I am proud of the depth I was able to achieve.

### Future Enhancements
- **User Accounts:** Model a `User` entity and create relationships with advocates.
- **User Health Concerns:** Model a `HealthConcerns` model that would create a relationship between specializations and Users.
- **Favorites:** Allow users to "favorite" or save advocates.
- **Dashboard:** Create a dashboard for users to manage their selected providers.
- **Insurance Filtering:** Add filters for supported insurance providers.
- **State Persistence:** Implement local storage to persist the onboarding state between refreshes.
- **Rich Media:** Add mock profile photos to the advocate cards.