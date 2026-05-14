# Notification System Design

## Stage 1

### API contract

#### GET /api/notifications
- Protected route. Requires `Authorization: Bearer notif-demo-token`.
- Query parameters:
  - `limit` (number, optional, default: 20, max 100)
  - `page` (number, optional, default: 1)
  - `notification_type` (string, optional, one of `Event`, `Result`, `Placement`)
  - `priority` (string, optional, one of `High`, `Medium`, `Low`)
  - `unseen` (boolean string, optional, `true` to return only unread notifications)

#### Response example
```
{
  "success": true,
  "meta": {
    "total": 32,
    "page": 1,
    "limit": 20,
    "totalPages": 2
  },
  "data": [
    {
      "_id": "64d28d8a80d1bc3ab01e2aa1",
      "studentId": "1042",
      "type": "Placement",
      "message": "Placement drive opening for final-year students.",
      "seen": false,
      "priority": "High",
      "timestamp": "2026-05-14T10:00:00.000Z"
    }
  ]
}
```

#### PATCH /api/notifications/:id
- Marks a notification as read.
- Request body: none.
- Response: updated notification.

#### POST /api/notifications
- Creates a notification for development and seeding.
- Request body:
  - `studentId` (string)
  - `type` (string)
  - `message` (string)
  - `priority` (string)
  - `metadata` (object)

### Data model

#### Notification document
- `studentId`: string (indexed)
- `type`: enum `[Event, Result, Placement]`
- `message`: string
- `seen`: boolean
- `priority`: enum `[Low, Medium, High]`
- `priorityValue`: number
- `metadata`: object
- `timestamp`: date

### Frontend behavior

- Fetch `/api/notifications` with query params for type, priority, and pagination.
- Show unread notifications as `New`.
- Provide a priority inbox by sorting high-priority notifications first.
- Filter by notification type using dropdown controls.

## Stage 2

### Storage design

A relational schema would store notifications as:
- `notifications(id, student_id, type, message, seen, priority, priority_value, metadata, timestamp)`

NoSQL/MongoDB is a good choice for this workload because:
- notifications are schema-friendly and append-heavy,
- queries are mostly read-heavy with simple filter criteria,
- storing metadata as JSON is natural.

#### Scaling considerations
- With 50,000 students and 5,000,000 notifications, a single collection must be indexed for `studentId`, `type`, `priority`, and `timestamp`.
- Partitioning by `studentId` or by time windows reduces scan size.
- Add a separate `student_inbox` or `top_notifications` table/collection for efficient top-10 retrieval.

## Stage 3

### Why the sample query is slow

The query:
```
SELECT * FROM notifications
WHERE studentID = 1042 AND isRead = false
ORDER BY createdAt ASC;
```

Problems:
- it returns all unread notifications instead of a limited page,
- ordering by `createdAt` ascending is counterproductive for a recent inbox,
- likely missing compound index on `(studentID, isRead, createdAt)`.

### Index recommendation
- Add a composite index on `(studentId, seen, timestamp)`.
- Optionally add `(studentId, type, priorityValue, timestamp)` for filter queries.

### Improved query
```
SELECT *
FROM notifications
WHERE studentId = '1042'
  AND seen = false
ORDER BY priorityValue DESC, timestamp DESC
LIMIT 50;
```

## Stage 4

### Performance strategy
- Avoid fetching all notifications on every page load.
- Use indexed query patterns and pagination.
- Cache the top 10 priority items in in-memory or Redis per student.
- For desktop/mobile, fetch only the current page and the unread summary count.

### Recommended approach
- Use `priorityValue` plus `timestamp` sort.
- Keep a materialized `priority_inbox` precomputed list for each student.
- Continue fetching full list lazily using pagination.

## Stage 5

### `notify_all` pseudocode
```
function notify_all(student_ids, message) {
  const batch = [];
  for (const student_id of student_ids) {
    batch.push({
      studentId: student_id,
      type: 'Placement',
      message,
      priority: 'High',
      timestamp: new Date(),
    });
  }
  Notification.insertMany(batch);
}
```

### Reliability improvements
- Save notifications in bulk with `insertMany`.
- Persist the notification event to durable storage before sending.
- Use background workers or a message queue for large fan-out.

## Stage 6

### Priority inbox design
- Priority score is derived from `priority` and `type`.
- Keep the top 10 unread/high-priority notifications by using a sorted index and limiting queries.
- For example, `SELECT ... ORDER BY priorityValue DESC, timestamp DESC LIMIT 10`.

### Maintenance strategy
- Maintain top 10 with a lightweight cache layer per user.
- Recompute only when new notifications arrive or read state changes.
- Archive older notifications in a second table/collection if needed.

## Stage 7

### Frontend expectations
- A responsive React page that shows all notifications and the priority inbox.
- The notification list can be filtered by type and priority.
- The UI must be usable on mobile and desktop.
- New notifications are clearly marked as unread and can be marked read.
- The solution and documentation are included in the same GitHub repository.
