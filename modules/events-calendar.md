---
title: Events Calendar
description: Build event calendars in CouchCMS - display events in traditional month/week/day grid format
category: core
tags: [calendar, events, cms:calendar, cms:weeks, cms:days, cms:entries]
difficulty: intermediate
---

# Events Calendar in CouchCMS

CouchCMS provides powerful calendar tags that display events in a traditional month grid format. Each cloned page becomes an event entry, with the publish date determining placement on the calendar.

## Overview

**What You'll Learn:**
- Creating calendar displays with `<cms:calendar>`
- Using nested tags: weeks, days, entries
- Associating templates with calendars
- Displaying events on specific dates
- Building navigable month-by-month calendars
- Handling multi-day events
- Time ranges and event details

**Core Concept:**
- Template = Event type (e.g., events.php)
- Cloned page = Individual event
- Publish date = Event date
- Editable regions = Event details

---

## Calendar Tag Hierarchy

Calendar tags are **nested** and must follow this structure:

```php
<cms:calendar>
   <cms:weeks>
      <cms:days>
         <cms:entries>
            <!-- Event details -->
         </cms:entries>
      </cms:days>
   </cms:weeks>
</cms:calendar>
```

**Rules:**
- `<cms:weeks>` works ONLY within `<cms:calendar>`
- `<cms:days>` works ONLY within `<cms:weeks>`
- `<cms:entries>` works ONLY within `<cms:days>`

---

## Basic Calendar Display

### Simple Month Grid

```php
<cms:calendar>
   <table class="calendar">
      <cms:weeks>
         <tr>
            <cms:days>
               <td><cms:show k_day /></td>
            </cms:days>
         </tr>
      </cms:weeks>
   </table>
</cms:calendar>
```

**How it works:**
- `<cms:weeks>` repeats 4-6 times (weeks in month)
- `<cms:days>` repeats 7 times per week (days)
- Creates traditional calendar grid

### With Headers

```php
<cms:calendar>
   <table class="calendar">
      <tr>
         <th colspan="7">
            <cms:date k_calendar_date format='F Y' />
         </th>
      </tr>
      <tr>
         <cms:repeat count='7'>
            <td class="heading">
               <cms:zebra 'Su' 'M' 'T' 'W' 'Th' 'F' 'S'/>
            </td>
         </cms:repeat>
      </tr>

      <cms:weeks>
         <tr>
            <cms:days>
               <td><cms:show k_day /></td>
            </cms:days>
         </tr>
      </cms:weeks>
   </table>
</cms:calendar>
```

**Output:**
```
     December 2025
Su  M  T  W  Th  F  S
    1  2  3   4  5  6
 7  8  9 10  11 12 13
14 15 16 17  18 19 20
21 22 23 24  25 26 27
28 29 30 31
```

---

## Calendar Variables

### cms:calendar Variables

| Variable | Description |
|----------|-------------|
| `k_count_weeks` | Number of weeks in month (4-6) |
| `k_calendar_date` | Month being displayed (yyyy-mm-dd) |
| `k_next_calendar_date` | Next month date |
| `k_prev_calendar_date` | Previous month date |

### cms:weeks Variables

| Variable | Description |
|----------|-------------|
| `k_week_num` | Current week number |

### cms:days Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `k_date` | Full date of day | 2025-12-25 |
| `k_day` | Day number | 25 |
| `k_month` | Month number | 12 |
| `k_year` | Year number | 2025 |
| `k_day_of_week` | Day of week (0-6) | 0 (Sunday) |
| `k_position` | `previous_month`, `current_month`, or `next_month` | |
| `k_timeline_position` | `past`, `present`, or `future` | |
| `k_count_entries` | Number of events on this day | 3 |

---

## Styling Calendar Days

### Highlight Today

```php
<cms:days>
   <cms:if k_timeline_position='present'>
      <cms:set tdclass='today' />
   <cms:else />
      <cms:set tdclass='' />
   </cms:if>

   <td class='<cms:show tdclass />'>
      <cms:show k_day />
   </td>
</cms:days>
```

### Highlight Current Month Days

```php
<cms:days>
   <cms:if k_position='current_month'>
      <td class='current'>
         <cms:show k_day />
      </td>
   <cms:else />
      <td class='other_month'>
         <cms:show k_day />
      </td>
   </cms:if>
</cms:days>
```

### Combined Styling

```php
<cms:days>
   <!-- Determine if today -->
   <cms:if k_timeline_position='present'>
      <cms:set tdclass='today' />
   <cms:else />
      <cms:set tdclass='' />
   </cms:if>

   <!-- Apply different styles based on month -->
   <cms:if k_position='current_month'>
      <td class='<cms:show tdclass />'>
         <cms:show k_day />
      </td>
   <cms:else />
      <td class='other_month'>
         <cms:show k_day />
      </td>
   </cms:if>
</cms:days>
```

---

## Attaching Templates to Calendar

### Basic Template Association

```php
<cms:calendar masterpage='events.php'>
   <table class="calendar">
      <cms:weeks>
         <tr>
            <cms:days>
               <!-- k_count_entries now available -->
               <cms:if k_count_entries>
                  <td class='has-events'>
                     <a href="<cms:link masterpage='events.php' year=k_year month=k_month day=k_day />">
                        <cms:show k_day />
                     </a>
                  </td>
               <cms:else />
                  <td><cms:show k_day /></td>
               </cms:if>
            </cms:days>
         </tr>
      </cms:weeks>
   </table>
</cms:calendar>
```

**Key Points:**
- `masterpage='events.php'` links template to calendar
- `k_count_entries` shows number of events on each day
- Days with events can be highlighted/linked

---

## Displaying Event Entries

### Small Calendar (Sidebar)

```php
<cms:calendar masterpage='events.php'>
   <table class="calendar-small">
      <tr>
         <th colspan="7">
            <cms:date k_calendar_date format='F Y' />
         </th>
      </tr>
      <tr>
         <cms:repeat count='7'>
            <td class="heading">
               <cms:zebra 'Su' 'M' 'T' 'W' 'Th' 'F' 'S'/>
            </td>
         </cms:repeat>
      </tr>

      <cms:weeks>
         <tr>
            <cms:days>
               <cms:if k_position='current_month'>
                  <cms:if k_count_entries>
                     <!-- Has events - link to daily archive -->
                     <td class='has-events'>
                        <a href="<cms:link masterpage='events.php' year=k_year month=k_month day=k_day />">
                           <cms:show k_day />
                        </a>
                     </td>
                  <cms:else />
                     <td><cms:show k_day /></td>
                  </cms:if>
               <cms:else />
                  <td class='other_month'>
                     <cms:show k_day />
                  </td>
               </cms:if>
            </cms:days>
         </tr>
      </cms:weeks>
   </table>
</cms:calendar>
```

### Large Calendar (Show Event Names)

```php
<cms:calendar masterpage='events.php'>
   <table class="calendar-big">
      <cms:weeks>
         <tr>
            <cms:days>
               <cms:if k_position='current_month'>
                  <td class='<cms:if k_count_entries>has-events</cms:if>'>
                     <div class="day-number"><cms:show k_day /></div>

                     <!-- List events for this day -->
                     <cms:entries limit='3' skip_custom_fields='1'>
                        <div class="event">
                           <a href="<cms:show k_page_link />">
                              <cms:show k_page_title />
                           </a>
                        </div>
                     </cms:entries>
                  </td>
               <cms:else />
                  <td class='other_month'>
                     <cms:show k_day />
                  </td>
               </cms:if>
            </cms:days>
         </tr>
      </cms:weeks>
   </table>
</cms:calendar>
```

**Note:** Use `skip_custom_fields='1'` to improve performance when you only need title/link.

---

## Calendar Navigation

### Month Navigation

```php
<cms:calendar date="<cms:gpc 'cal' />" masterpage='events.php'>
   <table class="calendar">
      <tr>
         <!-- Previous month -->
         <th>
            <a href="<cms:concat k_page_link '?cal=' k_prev_calendar_date />">
               &laquo;
            </a>
         </th>

         <!-- Current month -->
         <th colspan="5">
            <cms:date k_calendar_date format='F Y' />
         </th>

         <!-- Next month -->
         <th>
            <a href="<cms:concat k_page_link '?cal=' k_next_calendar_date />">
               &raquo;
            </a>
         </th>
      </tr>

      <!-- Rest of calendar -->
   </table>
</cms:calendar>
```

**How it works:**
1. `<cms:gpc 'cal' />` gets date from querystring (`?cal=2025-12-01`)
2. If no querystring, displays current month
3. Navigation links update querystring parameter

---

## Event Template Setup

### Basic Event Template

```php
<?php require_once('couch/cms.php'); ?>
<cms:template title='Events' clonable='1'>
   <cms:editable name='desc' label='Description' type='richtext' />
   <cms:editable name='location' label='Location' type='text' />
   <cms:editable name='start_time' label='Start Time' type='text' />
   <cms:editable name='end_time' label='End Time' type='text' />
</cms:template>

<!-- Template HTML -->
<?php COUCH::invoke(); ?>
```

### Advanced Event Template

```php
<?php require_once('couch/cms.php'); ?>
<cms:template title='Events' clonable='1'>
   <cms:editable name='desc' label='Description' type='richtext' />
   <cms:editable name='location' label='Location' type='text' />

   <!-- Time dropdowns (24-hour format) -->
   <cms:editable name="start_time" label="Time From (24 Hrs)"
      opt_values='Unspecified |
                  00:00 | 00:30 | 01:00 | 01:30 | 02:00 | 02:30 |
                  03:00 | 03:30 | 04:00 | 04:30 | 05:00 | 05:30 |
                  06:00 | 06:30 | 07:00 | 07:30 | 08:00 | 08:30 |
                  09:00 | 09:30 | 10:00 | 10:30 | 11:00 | 11:30 |
                  12:00 | 12:30 | 13:00 | 13:30 | 14:00 | 14:30 |
                  15:00 | 15:30 | 16:00 | 16:30 | 17:00 | 17:30 |
                  18:00 | 18:30 | 19:00 | 19:30 | 20:00 | 20:30 |
                  21:00 | 21:30 | 22:00 | 22:30 | 23:00 | 23:30'
      type='dropdown'
   />

   <cms:editable name="end_time" label="Time Until (24 Hrs)"
      opt_values='Unspecified |
                  00:00 | 00:30 | 01:00 | 01:30 | 02:00 | 02:30 |
                  03:00 | 03:30 | 04:00 | 04:30 | 05:00 | 05:30 |
                  06:00 | 06:30 | 07:00 | 07:30 | 08:00 | 08:30 |
                  09:00 | 09:30 | 10:00 | 10:30 | 11:00 | 11:30 |
                  12:00 | 12:30 | 13:00 | 13:30 | 14:00 | 14:30 |
                  15:00 | 15:30 | 16:00 | 16:30 | 17:00 | 17:30 |
                  18:00 | 18:30 | 19:00 | 19:30 | 20:00 | 20:30 |
                  21:00 | 21:30 | 22:00 | 22:30 | 23:00 | 23:30'
      type='dropdown'
   />

   <!-- Multi-day events support -->
   <cms:editable name='end_date'
      label='Event End Date (if multi-day event)'
      desc='Enter date in yyyy-mm-dd format e.g. 2025-12-31'
      type='text'
      validator='regex=/(?:19|20)\d\d-(?:0[1-9]|1[012])-(?:0[1-9]|[12][0-9]|3[01])/'
      separator='#'
      validator_msg='regex=Incorrect date format'
   />

   <cms:editable name='featured_image' type='image' />
   <cms:editable name='event_category' label='Category' type='text' />
</cms:template>

<!-- Template views handled below -->
<?php COUCH::invoke(); ?>
```

---

## Complete Working Example

```php
<?php require_once('couch/cms.php'); ?>
<cms:template title='Events' clonable='1'>
   <cms:editable name='desc' label='Description' type='richtext' />
   <cms:editable name='location' label='Location' type='text' />
   <cms:editable name='start_time' label='Start Time' type='text' />
   <cms:editable name='end_time' label='End Time' type='text' />

   <cms:editable name='end_date'
      label='End Date (multi-day events)'
      type='text'
      validator='regex=/(?:19|20)\d\d-(?:0[1-9]|1[012])-(?:0[1-9]|[12][0-9]|3[01])/'
   />
</cms:template>

<!DOCTYPE html>
<html lang="en">
<head>
   <meta charset="UTF-8">
   <title><cms:if k_is_page><cms:show k_page_title /><cms:else />Events Calendar</cms:if></title>
   <link href="<cms:show k_site_link />css/output.css" rel="stylesheet" />
</head>
<body>
   <cms:if k_is_page>
      <!-- Page View: Single Event -->
      <div class="container mx-auto p-6">
         <h1 class="text-3xl font-bold"><cms:show k_page_title /></h1>

         <div class="card bg-base-100 shadow-xl mt-6">
            <div class="card-body">
               <p><strong>Date:</strong> <cms:date k_page_date format='F j, Y' /></p>

               <cms:if start_time ne 'Unspecified'>
                  <p><strong>From:</strong> <cms:show start_time /></p>
               </cms:if>

               <cms:if "<cms:not_empty end_date />">
                  <p><strong>End Date:</strong> <cms:date end_date format='F j, Y' /></p>
               </cms:if>

               <cms:if end_time ne 'Unspecified'>
                  <p><strong>Until:</strong> <cms:show end_time /></p>
               </cms:if>

               <p><strong>Location:</strong> <cms:show location /></p>

               <div class="mt-4">
                  <cms:show desc />
               </div>
            </div>
         </div>
      </div>

   <cms:else />
      <!-- List View: Calendar -->
      <div class="container mx-auto p-6">
         <h1 class="text-3xl font-bold mb-6">Events Calendar</h1>

         <cms:calendar date="<cms:gpc 'cal' />"
                       masterpage=k_template_name
                       show_future_entries='1'>

            <table class="table table-zebra w-full">
               <thead>
                  <tr>
                     <th>
                        <a href="<cms:concat k_page_link '?cal=' k_prev_calendar_date />"
                           class="btn btn-sm btn-ghost">
                           &laquo;
                        </a>
                     </th>
                     <th colspan="5" class="text-center text-xl">
                        <cms:date k_calendar_date format='F Y' />
                     </th>
                     <th>
                        <a href="<cms:concat k_page_link '?cal=' k_next_calendar_date />"
                           class="btn btn-sm btn-ghost">
                           &raquo;
                        </a>
                     </th>
                  </tr>
                  <tr>
                     <cms:repeat count='7'>
                        <th class="text-center">
                           <cms:zebra 'Sun' 'Mon' 'Tue' 'Wed' 'Thu' 'Fri' 'Sat'/>
                        </th>
                     </cms:repeat>
                  </tr>
               </thead>

               <tbody>
                  <cms:weeks>
                     <tr>
                        <cms:days>
                           <cms:if k_timeline_position='present'>
                              <cms:set tdclass='bg-primary text-primary-content' />
                           <cms:else />
                              <cms:set tdclass='' />
                           </cms:if>

                           <cms:if k_position='current_month'>
                              <td class='<cms:show tdclass /> p-2 align-top'>
                                 <div class="font-bold"><cms:show k_day /></div>

                                 <cms:if k_count_entries>
                                    <div class="mt-2 space-y-1">
                                       <cms:entries limit='3' skip_custom_fields='1'>
                                          <div class="badge badge-sm badge-accent">
                                             <a href="<cms:show k_page_link />">
                                                <cms:show k_page_title />
                                             </a>
                                          </div>
                                       </cms:entries>
                                    </div>
                                 </cms:if>
                              </td>
                           <cms:else />
                              <td class='text-base-300 p-2'>
                                 <cms:show k_day />
                              </td>
                           </cms:if>
                        </cms:days>
                     </tr>
                  </cms:weeks>
               </tbody>
            </table>
         </cms:calendar>
      </div>
   </cms:if>
</body>
</html>
<?php COUCH::invoke(); ?>
```

---

## Future Events Handling

### show_future_entries Parameter

By default, `<cms:calendar>` (like `<cms:pages>`) skips future-dated entries.

**For events, you usually WANT future entries:**

```php
<cms:calendar masterpage='events.php' show_future_entries='1'>
```

This ensures upcoming events appear on the calendar.

---

## Integration with TailwindCSS & daisyUI

### Modern Calendar with daisyUI

```php
<cms:calendar masterpage='events.php' show_future_entries='1'>
   <div class="card bg-base-100 shadow-xl">
      <div class="card-body">
         <!-- Header with navigation -->
         <div class="flex justify-between items-center mb-4">
            <a href="?cal=<cms:show k_prev_calendar_date />"
               class="btn btn-sm btn-circle btn-ghost">
               ‹
            </a>
            <h2 class="card-title text-2xl">
               <cms:date k_calendar_date format='F Y' />
            </h2>
            <a href="?cal=<cms:show k_next_calendar_date />"
               class="btn btn-sm btn-circle btn-ghost">
               ›
            </a>
         </div>

         <!-- Calendar grid -->
         <div class="grid grid-cols-7 gap-2">
            <!-- Day headers -->
            <cms:repeat count='7'>
               <div class="text-center font-bold text-sm">
                  <cms:zebra 'S' 'M' 'T' 'W' 'T' 'F' 'S'/>
               </div>
            </cms:repeat>

            <!-- Days -->
            <cms:weeks>
               <cms:days>
                  <div class="
                     <cms:if k_position='current_month'>bg-base-200<cms:else />bg-base-300 text-base-content/30</cms:if>
                     <cms:if k_timeline_position='present'> ring-2 ring-primary</cms:if>
                     <cms:if k_count_entries> badge badge-accent</cms:if>
                     rounded p-2 min-h-[60px]
                  ">
                     <div class="text-sm font-semibold"><cms:show k_day /></div>

                     <cms:if k_count_entries>
                        <div class="text-xs mt-1 space-y-1">
                           <cms:entries limit='2' skip_custom_fields='1'>
                              <a href="<cms:show k_page_link />"
                                 class="block truncate hover:text-primary">
                                 <cms:show k_page_title />
                              </a>
                           </cms:entries>
                        </div>
                     </cms:if>
                  </div>
               </cms:days>
            </cms:weeks>
         </div>
      </div>
   </div>
</cms:calendar>
```

---

## Best Practices

### Performance
- Use `skip_custom_fields='1'` in `<cms:entries>` when only showing titles
- Limit entries per day with `limit` parameter
- Cache calendar output for high-traffic sites

### User Experience
- Always include month navigation (prev/next)
- Highlight today's date
- Show visual distinction for days with events
- Link event names to detail pages

### Event Management
- Use publish date for event date (required)
- Add `end_date` field for multi-day events
- Use dropdown for time selection (better UX than text input)
- Validate date formats with regex

### Future Events
- Always set `show_future_entries='1'` for event calendars
- Consider adding filtering by date range
- Show "upcoming events" list alongside calendar

---

## Common Patterns

### Sidebar Mini Calendar

```php
<div class="widget">
   <h3>Events</h3>
   <cms:calendar masterpage='events.php' show_future_entries='1'>
      <table class="mini-calendar">
         <cms:weeks>
            <tr>
               <cms:days>
                  <cms:if k_position='current_month'>
                     <td class='<cms:if k_count_entries>has-event</cms:if>'>
                        <cms:if k_count_entries>
                           <a href="<cms:link masterpage='events.php' year=k_year month=k_month day=k_day />">
                              <cms:show k_day />
                           </a>
                        <cms:else />
                           <cms:show k_day />
                        </cms:if>
                     </td>
                  <cms:else />
                     <td class='other'><cms:show k_day /></td>
                  </cms:if>
               </cms:days>
            </tr>
         </cms:weeks>
      </table>
   </cms:calendar>
</div>
```

### Upcoming Events List

```php
<div class="upcoming-events">
   <h2>Upcoming Events</h2>
   <cms:pages masterpage='events.php' limit='5' show_future_entries='1'>
      <div class="event-item">
         <h3><a href="<cms:show k_page_link />"><cms:show k_page_title /></a></h3>
         <p class="date"><cms:date k_page_date format='F j, Y' /></p>
         <p class="location"><cms:show location /></p>
      </div>
   </cms:pages>
</div>
```

---

## Related Tags

- `<cms:calendar>` - Main calendar container
- `<cms:weeks>` - Iterate through weeks (use within calendar)
- `<cms:days>` - Iterate through days (use within weeks)
- `<cms:entries>` - Iterate through events on a day (use within days)
- `<cms:pages>` - List events outside calendar context
- `<cms:link>` - Generate archive view links
- `<cms:gpc>` - Get querystring parameters
- `<cms:date>` - Format dates

---

## Additional Resources

- [CouchCMS Documentation - Calendar](https://docs.couchcms.com/tags-reference/calendar.html)
- [Download calendar.css](https://www.couchcms.com/docs/code/calendar.css)
