# Text Box Feature - User Guide

## How to Add a Geolocated Text Box

### Step-by-Step Instructions:

1. **Open the Text Box Panel**
   - Look for the **cyan button** with a message icon (💬) in the left control panel
   - Click on it to open the "Add Text Box" dialog

2. **Select Location Mode**
   - Click the **"Select Location"** (or "Konum Seç" in Turkish) button
   - The button will change to show "Cancel" and a yellow message will appear

3. **Click on the Map**
   - Click anywhere on the map where you want to place your text box
   - You'll see a green confirmation message with the coordinates

4. **Fill in the Details**
   - **Title**: Enter a name/title for your text box (optional)
   - **Content**: Write your text content (required)
   - Both fields will be enabled after selecting a location

5. **Save the Text Box**
   - Click the green **"Save"** (or "Kaydet") button
   - The dialog will close automatically
   - Your text box pin will appear on the map as a blue circle with a message icon

## Managing Text Boxes

### View a Text Box
- Click on any blue text box marker on the map
- A popup will show the title, content, and timestamp

### Delete a Text Box
- Click on a text box marker to open its popup
- Click the red trash icon (🗑️) in the top-right corner
- Confirm the deletion in the dialog

### Toggle Visibility
- After creating at least one text box, a toggle control appears in the bottom-right corner
- Click it to show/hide all text boxes at once
- The counter shows how many text boxes exist

## Features

✅ **Persistent Storage**: Text boxes are saved in your browser's localStorage
✅ **Bilingual**: Full support for Turkish and English
✅ **Visual Feedback**: Clear indicators for each step
✅ **Easy Management**: Delete individual text boxes or toggle all at once
✅ **Coordinates Display**: See exact lat/lng when selecting location

## Troubleshooting

**Problem**: Can't enter text in the fields
- **Solution**: Make sure you've clicked on the map to select a location first

**Problem**: Save button is disabled
- **Solution**: You need both a location AND some content (title or text)

**Problem**: Text boxes don't appear after saving
- **Solution**: Check if the toggle control in bottom-right is set to "Show"

**Problem**: Text boxes disappeared after refresh
- **Solution**: Check browser console for localStorage errors. Try clearing cache.

## Technical Details

- **Storage**: Browser localStorage (key: 'atlasTextBoxes')
- **Format**: JSON array of text box objects
- **Coordinates**: Stored as {lat, lng} objects
- **IDs**: Generated using timestamp (Date.now())
