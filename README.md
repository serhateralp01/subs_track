
# Subscription Tracker

A modern, responsive web application to track your recurring subscriptions. Easily add, view, and manage your subscriptions with details like cost, payment method, and billing cycle. The app automatically calculates monthly and annual costs for better financial planning and stores your data securely in your browser's local storage.

![A screenshot of the Subscription Tracker application showing a list of subscriptions and a form to add a new one.](https://i.imgur.com/8Q9Z5rG.png)

## ✨ Features

- **Add Subscriptions:** A comprehensive form to add new subscriptions with details like name, payment method, category, payer, billing cycle, and more.
- **Dynamic Price Calculation:** Enter a monthly or annual price, and the other is calculated automatically.
- **Clear Overview:** Subscriptions are displayed as clean, easy-to-read cards in a responsive grid.
- **Sortable List:** Easily sort subscriptions by name, price, or next bill date to quickly find what you're looking for.
- **Cost Summary:** A sticky header shows the total monthly and annual cost of all your subscriptions for an at-a-glance financial overview.
- **Persistent Data:** Your subscription list is saved in your browser's `localStorage`, so your data persists between sessions.
- **Safe Deletion:** A confirmation prompt prevents you from accidentally deleting a subscription.
- **Responsive Design:** Looks and works great on devices of all sizes, from mobile phones to desktops.
- **Built with Modern Tech:** Crafted with React, TypeScript, and Tailwind CSS for a robust and maintainable codebase.

## 🚀 Getting Started

This project is set up with a modern, build-less development environment using ES modules. You don't need to install any dependencies with `npm` or `yarn`.

To run the application locally, you just need a simple local web server.

1.  **Have the files ready:**
    Ensure all the project files are in a single folder on your computer.

2.  **Serve the directory:**
    The easiest way is to use the **[Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer)** extension for VS Code. Simply right-click on `index.html` and select "Open with Live Server".

    Alternatively, you can use Python's built-in web server. If you have Python installed, open your terminal, navigate to the project's root directory, and run one of the following commands:

    *   **Python 3:**
        ```bash
        python -m http.server
        ```
    *   **Python 2:**
        ```bash
        python -m SimpleHTTPServer
        ```
    Then, open your browser and navigate to `http://localhost:8000`.

## 📂 File Structure

```
.
├── components/
│   ├── icons/
│   │   ├── PlusIcon.tsx       # SVG icon for add actions
│   │   └── TrashIcon.tsx      # SVG icon for delete actions
│   ├── SubscriptionCard.tsx   # Component for a single subscription item
│   ├── SubscriptionForm.tsx   # The main form for adding new subscriptions
│   └── SubscriptionList.tsx   # Component to display the list of subscriptions and totals
├── App.tsx                    # Main application component, manages state
├── constants.ts               # Shared constants (categories, payers)
├── index.html                 # The entry point of the application
├── index.tsx                  # Mounts the React application to the DOM
├── metadata.json              # Application metadata
├── README.md                  # You are here!
└── types.ts                   # TypeScript type definitions
```

## 🐛 Debugging Tips

If you run into any issues, here are a few things to check:

1.  **Open the Browser Developer Console:** This is the most important debugging tool. Press `Cmd+Opt+J` (Mac) or `Ctrl+Shift+J` (Windows/Linux) in your browser. Look for any red error messages, which often point directly to the problem.

2.  **localStorage Issues:**
    *   The application stores all data in your browser's `localStorage` under the key `subscriptions`.
    *   **To inspect:** Open the developer tools, go to the "Application" tab (in Chrome) or "Storage" tab (in Firefox), find "Local Storage" in the sidebar, and select the corresponding domain (e.g., `http://127.0.0.1:5500`). You can see the `subscriptions` key and its JSON value.
    *   **To reset:** If the app is crashing on load, the stored data might be corrupted. You can right-click the `subscriptions` key in the developer tools and delete it, then refresh the page. The app will start fresh. The `App.tsx` file includes `try...catch` blocks to prevent crashes from bad data, but a manual reset is a good final resort.

3.  **React Developer Tools:**
    *   Install the [React Developer Tools extension](https://react.dev/learn/react-developer-tools) for your browser.
    *   It adds "Components" and "Profiler" tabs to your browser's developer tools.
    *   This allows you to inspect the component tree, view the `state` and `props` of each component (like `App.tsx`'s `subscriptions` state), and see how they change in real-time. This is incredibly useful for seeing if data is flowing correctly.

4.  **Form Not Submitting:**
    *   The form requires the "Subscription Name" and "Price" fields to be filled out. If you click "Add Subscription" and nothing happens, check if an alert box saying "Please fill in at least the name and price." appears.
    *   Check the console for any other errors that might prevent the `handleSubmit` function from working correctly.

5.  **Styling Looks Wrong:**
    *   Ensure your internet connection is active, as Tailwind CSS is loaded from a CDN.
    *   Use the browser's element inspector (right-click an element -> "Inspect") to check if the Tailwind classes are being applied correctly to the HTML elements.