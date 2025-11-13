# Workflows Quick Start Guide

## 🚀 5-Minute Quick Start

### Your First Workflow in 3 Steps

#### 1️⃣ Open Workflows
```
Click: ⚙️ Workflows tab
See: 5 workflow cards
```

#### 2️⃣ Run a Workflow
```
Click: ▶ Run on "Jurisdictional Nexus Check"
Fill: Business activities, states, revenue
Click: ▶ Run Step (for each step)
Watch: Progress from ⭕ → ⏳ → ✅
```

#### 3️⃣ View Results
```
See: Tables, drafts, and analysis
Click: Complete Workflow
Done! ✅
```

---

## 📋 The Three Views

### 🏠 Home View
**What you see:**
```
┌─────────────────────────────────────┐
│ 🔍 Search...    [All][Research]...  │
├─────────────────────────────────────┤
│ ┌──────────┐  ┌──────────┐         │
│ │ Nexus    │  │ R&D      │         │
│ │ Check    │  │ Credit   │         │
│ │ Research │  │ Filing   │         │
│ │ 📊 5 runs│  │ 📊 12    │         │
│ │ [Run][Edit] [Run][Edit]          │
│ └──────────┘  └──────────┘         │
└─────────────────────────────────────┘
```

**What you can do:**
- ✅ Search workflows
- ✅ Filter by tags
- ✅ Run workflows
- ✅ Edit workflows
- ✅ Create new workflows

---

### 🔨 Builder View
**What you see:**
```
┌──────────┬──────────────────────────┐
│ Workflow │ Step Editor              │
│ Details  │                          │
├──────────┼──────────────────────────┤
│ Name:    │ [Inputs][Tools][Prompt]  │
│ [____]   │ [Outputs][Trace]         │
│          │                          │
│ Desc:    │ Input Schema:            │
│ [____]   │ ┌──────────────────────┐ │
│          │ │ businessActivities   │ │
│ Stepper: │ │ [text] *required     │ │
│ 1 ● Step1│ └──────────────────────┘ │
│   │      │                          │
│ 2 ○ Step2│ [+ Add Input Field]      │
│   │      │                          │
│ 3 ○ Step3│ Tools:                   │
│          │ 🔧 nexus_analyzer [×]    │
│ [+ Add]  │                          │
│          │ [+ Add Tool]             │
│ [Cancel] │                          │
│ [Save]   │ Prompt Template:         │
└──────────┴──────────────────────────┘
```

**What you can do:**
- ✅ Name workflow
- ✅ Add/remove steps
- ✅ Configure inputs
- ✅ Select tools
- ✅ Write prompts
- ✅ Define outputs
- ✅ Preview trace

---

### ▶️ Runner View
**What you see:**
```
┌──────────┬──────────────────────────┐
│ Progress │ Current Step             │
├──────────┼──────────────────────────┤
│ ✅ Step1 │ 📝 Inputs:               │
│ ⏳ Step2 │ ┌──────────────────────┐ │
│ ⭕ Step3 │ │ Business Activities: │ │
│ ⭕ Step4 │ │ [____________]       │ │
│ ⭕ Step5 │ │                      │ │
│          │ │ States:              │ │
│ Run ID:  │ │ [____________]       │ │
│ abc123   │ └──────────────────────┘ │
│          │                          │
│          │ [▶ Run Step]             │
│          │                          │
│          │ 📊 Output:               │
│          │ ┌──────────────────────┐ │
│          │ │ State  | Nexus       │ │
│          │ │ CA     | Yes         │ │
│          │ │ TX     | Yes         │ │
│          │ └──────────────────────┘ │
│          │                          │
│[Complete]│ [🔄 Re-run]             │
└──────────┴──────────────────────────┘
```

**What you can do:**
- ✅ Fill inputs
- ✅ Run steps
- ✅ View outputs
- ✅ Re-run steps
- ✅ Edit inputs
- ✅ Track progress

---

## 🎬 Example Scenarios

### Scenario 1: Quick Nexus Check
```
1. Click Workflows tab
2. Click Run on "Nexus Check"
3. Enter: "Software sales" + "CA, TX" + "$2M"
4. Click Run Step × 5
5. See results table
6. Click Complete
⏱️ Time: 2 minutes
```

### Scenario 2: Create Custom Workflow
```
1. Click + Create Workflow
2. Name: "Charitable Deduction Check"
3. Click + Add Step → Collect Inputs
4. Add fields: donor, amount, org
5. Click + Add Step → Run Analyses
6. Add tool: deduction_calculator
7. Click Save
⏱️ Time: 5 minutes
```

### Scenario 3: Edit Existing Workflow
```
1. Find "R&D Credit" card
2. Click Edit
3. Click Step 3
4. Go to Prompt tab
5. Update prompt text
6. Click Save
⏱️ Time: 2 minutes
```

---

## 🎯 Step Types Cheat Sheet

| Icon | Type | When to Use | Example |
|------|------|-------------|---------|
| 📝 | Collect | Gather user input | Client intake form |
| 🔄 | Normalize | Process documents | Extract W-2 data |
| 🔍 | Analyze | Run calculations | Calculate tax liability |
| ✍️ | Draft | Generate documents | Create memo |
| ✅ | Review | Validate output | Check citations |

---

## 🏷️ Tag Guide

| Tag | Color | Use For |
|-----|-------|---------|
| Research | 🔵 Blue | Legal research, analysis |
| Review | 🟡 Yellow | QA, validation |
| Filing | 🟢 Green | Return prep, forms |
| Advisory | 🟣 Purple | Planning, recommendations |

---

## ⌨️ Common Actions

### In Home View
```
Search:        Type in search box
Filter:        Click tag buttons
Run:           Click ▶ Run button
Edit:          Click ✏️ Edit button
Create:        Click + Create Workflow
```

### In Builder View
```
Add Step:      Click + Add Step
Edit Step:     Click step in stepper
Add Input:     Click + Add Input Field
Add Tool:      Click + Add Tool
Save:          Click Save button
Cancel:        Click Cancel button
```

### In Runner View
```
Run Step:      Click ▶ Run Step
Re-run:        Click 🔄 Re-run
Edit Input:    Type in input fields
Next Step:     Click step in sidebar
Complete:      Click Complete Workflow
```

---

## 📊 Status Icons

| Icon | Status | Meaning |
|------|--------|---------|
| ⭕ | Pending | Not started |
| ⏳ | Running | In progress |
| ✅ | Done | Completed |
| ⚠️ | Needs Attention | Requires action |

---

## 💡 Pro Tips

### Tip 1: Start with Templates
```
✅ Use pre-built workflows first
✅ Understand the flow
✅ Then customize
```

### Tip 2: Use Variables in Prompts
```
❌ "Calculate the tax"
✅ "Calculate tax for {{clientName}} with income {{amount}}"
```

### Tip 3: Tag Everything
```
✅ Add relevant tags
✅ Makes searching easier
✅ Organizes your library
```

### Tip 4: Re-run Instead of Restart
```
✅ Made a mistake? Re-run the step
✅ Don't start the whole workflow over
✅ Saves time
```

### Tip 5: Preview with Trace
```
✅ Use Trace tab to preview
✅ See what will happen
✅ Debug before running
```

---

## 🎓 Learning Path

### Week 1: Explore
- [ ] Run all 5 seed templates
- [ ] Understand each step type
- [ ] Learn the interface

### Week 2: Customize
- [ ] Edit an existing workflow
- [ ] Add a new step
- [ ] Modify prompts

### Week 3: Create
- [ ] Build your first workflow
- [ ] Test it thoroughly
- [ ] Share with team

### Week 4: Master
- [ ] Create complex workflows
- [ ] Use advanced features
- [ ] Optimize for efficiency

---

## 🆘 Troubleshooting

### Problem: Can't find a workflow
```
Solution:
1. Clear search box
2. Click "All" tag
3. Scroll through list
```

### Problem: Step won't run
```
Solution:
1. Check required inputs are filled
2. Look for validation errors
3. Try re-running previous step
```

### Problem: Wrong output
```
Solution:
1. Click Re-run Step
2. Edit inputs
3. Check prompt template
```

### Problem: Lost changes
```
Solution:
1. Always click Save in Builder
2. Changes auto-save in Runner
3. Check Last Edited date
```

---

## 📱 Mobile Tips

### Responsive Design
```
✅ Works on tablets
✅ Mobile menu available
✅ Touch-friendly buttons
⚠️ Best on desktop for building
```

---

## 🎯 Success Metrics

### You're Doing It Right When:
- ✅ Workflows complete without errors
- ✅ Outputs are accurate
- ✅ You're reusing workflows
- ✅ Team is collaborating
- ✅ Time savings are measurable

### You Might Need Help When:
- ❌ Every step needs re-running
- ❌ Outputs don't make sense
- ❌ Workflows are too complex
- ❌ Nobody uses them
- ❌ More time than manual process

---

## 🚀 Next Steps

### After This Guide:
1. ✅ Read full walkthrough (WORKFLOWS_WALKTHROUGH.md)
2. ✅ Review implementation docs (WORKFLOWS_IMPLEMENTATION.md)
3. ✅ Start with Nexus Check template
4. ✅ Create your first custom workflow
5. ✅ Share with your team

---

## 📞 Quick Reference Card

```
┌─────────────────────────────────────┐
│ WORKFLOWS QUICK REFERENCE           │
├─────────────────────────────────────┤
│ Open:     ⚙️ Workflows tab          │
│ Search:   🔍 Type in search box     │
│ Filter:   Click tag buttons         │
│ Run:      ▶ Run button              │
│ Edit:     ✏️ Edit button            │
│ Create:   + Create Workflow         │
│ Add Step: + Add Step                │
│ Save:     Save button               │
│ Re-run:   🔄 Re-run button          │
│ Complete: Complete Workflow         │
├─────────────────────────────────────┤
│ Status Icons:                       │
│ ⭕ Pending  ⏳ Running              │
│ ✅ Done     ⚠️ Needs Attention      │
├─────────────────────────────────────┤
│ Step Types:                         │
│ 📝 Collect  🔄 Normalize            │
│ 🔍 Analyze  ✍️ Draft                │
│ ✅ Review                           │
└─────────────────────────────────────┘
```

---

## ✅ You're Ready!

**You now know how to:**
- ✅ Navigate the Workflows tab
- ✅ Run pre-built workflows
- ✅ Create custom workflows
- ✅ Edit and modify workflows
- ✅ Use all three views
- ✅ Understand step types
- ✅ Track progress
- ✅ Handle errors

**Go build amazing workflows!** 🎉
