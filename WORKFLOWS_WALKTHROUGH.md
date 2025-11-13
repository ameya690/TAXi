# Workflows Walkthrough - Step-by-Step Examples

## 🎯 Complete Guide to Using the Workflows Tab

This guide provides detailed walkthroughs for common workflow scenarios.

---

## Example 1: Running a Pre-Built Workflow (Nexus Check)

### Scenario
You need to determine if your client has state tax nexus in California and Texas based on their business activities.

### Step-by-Step Walkthrough

#### Step 1: Navigate to Workflows
1. Click the **⚙️ Workflows** tab in the main navigation
2. You'll see the Workflow Library (Home view)

#### Step 2: Find the Workflow
1. You'll see 5 workflow cards displayed
2. Look for **"Jurisdictional Nexus Check"**
3. Notice the tags: `Research` `Advisory`
4. See metadata: `📊 0 runs` and `📅 Today`

#### Step 3: Start the Workflow
1. Click the **▶ Run** button on the Nexus Check card
2. The view switches to the **Runner** interface
3. You'll see:
   - **Left sidebar**: Progress with 5 steps (all showing ⭕ Pending)
   - **Main area**: Step 1 "Collect Inputs" is active

#### Step 4: Fill in Inputs (Step 1)
The first step shows input fields:

```
📝 Inputs
─────────────────────────────────
Business Activities *
[Text field: "Software development and consulting services"]

States to Analyze *
[Multi-select: Select California, Texas]

Annual Revenue *
[Number field: 5000000]

Number of Employees
[Number field: 25]
```

1. Enter business activities: `"Software development and consulting services"`
2. Select states: `California, Texas`
3. Enter revenue: `5000000`
4. Enter employees: `25`
5. Click **▶ Run Step**

#### Step 5: Watch Progress
1. Step 1 status changes to ⏳ **Running** (yellow)
2. After 2 seconds, it changes to ✅ **Done** (green)
3. You see output: Collected data displayed
4. Step 2 automatically becomes active

#### Step 6: Continue Through Steps

**Step 2: Normalize Documents**
- Status shows ⭕ Pending
- Click **▶ Run Step**
- Simulates document extraction
- Changes to ✅ Done

**Step 3: Run Nexus Analysis**
- Click **▶ Run Step**
- After processing, you see a **table artifact**:

```
📊 Output
─────────────────────────────────
State      | Nexus Status | Reason
─────────────────────────────────
California | Yes          | Physical presence
Texas      | Yes          | Economic nexus
Nevada     | No           | No substantial activity
```

**Step 4: Assemble Draft Report**
- Click **▶ Run Step**
- You see a **draft document**:

```
📄 Output
─────────────────────────────────
# Jurisdictional Nexus Analysis

## Key Findings

- California: Nexus established through physical presence
- Texas: Economic nexus threshold exceeded
- Nevada: No nexus obligations

## Recommendations
...
```

**Step 5: QA & Citations**
- Click **▶ Run Step**
- Final validation completes
- All steps now show ✅ Done

#### Step 7: Complete Workflow
1. All steps in sidebar show ✅ green checkmarks
2. Click **Complete Workflow** button at bottom of sidebar
3. Returns to Workflow Library
4. Nexus Check card now shows `📊 1 run`

---

## Example 2: Creating a Custom Workflow from Scratch

### Scenario
You want to create a workflow for analyzing charitable contribution deductions.

### Step-by-Step Walkthrough

#### Step 1: Create New Workflow
1. Go to **⚙️ Workflows** tab
2. Click **+ Create Workflow** button (top right)
3. Builder view opens with empty workflow

#### Step 2: Name Your Workflow
1. In the left sidebar, you see two input fields
2. Click the **Workflow Name** field
3. Type: `"Charitable Contribution Analysis"`
4. Click the **Description** field
5. Type: `"Analyze and validate charitable contributions for deduction eligibility"`

#### Step 3: Add First Step (Collect Donor Info)
1. Click **+ Add Step** button at bottom of stepper
2. A modal appears with 5 step templates:
   ```
   📝 Collect Inputs    (collect)
   🔄 Normalize Docs    (transform)
   🔍 Run Analyses      (analyze)
   ✍️ Assemble Draft    (draft)
   ✅ QA & Citations    (review)
   ```
3. Click **📝 Collect Inputs**
4. Step appears in stepper as "Step 1"

#### Step 4: Configure Step 1
The step editor opens on the right with 5 tabs.

**Click "Inputs" tab:**
1. Click **+ Add Input Field**
2. Prompt appears: "Enter field name:"
3. Type: `donorName`
4. A new field appears in the schema:
   ```
   donorName          [text]  
   ```

5. Repeat to add more fields:
   - `donationType` (select: Cash, Property, Services)
   - `donationAmount` (number) *required
   - `donationDate` (text)
   - `recipientOrg` (text) *required

**Click "Tools" tab:**
1. Click **+ Add Tool**
2. Type: `irs_pub_526_lookup`
3. Tool chip appears: `🔧 irs_pub_526_lookup [×]`

**Click "Prompt" tab:**
1. In the textarea, type:
   ```
   Collect information about {{donorName}}'s {{donationType}} 
   donation of {{donationAmount}} to {{recipientOrg}} on 
   {{donationDate}}.
   ```
2. Notice the hint: "💡 Use {{ and }} to reference input variables"

**Click "Trace" tab:**
1. See preview:
   ```
   → Step: Collect Inputs
   → Type: collect
   → Tools: irs_pub_526_lookup
   → Inputs: 5 fields
   → Outputs: 0 fields
   → Prompt:
     Collect information about {{donorName}}'s...
   ```

#### Step 5: Add More Steps
1. Click **+ Add Step** again
2. Select **🔍 Run Analyses**
3. Name it: "Validate Deductibility"
4. Configure:
   - **Tools**: `deduction_calculator`, `org_status_checker`
   - **Prompt**: `Verify that {{recipientOrg}} is a qualified 501(c)(3) organization and calculate the deductible amount for {{donationType}} donation of {{donationAmount}}.`

5. Add another step: **✍️ Assemble Draft**
6. Name it: "Generate Substantiation Letter"
7. Configure:
   - **Tools**: `letter_generator`
   - **Prompt**: `Create a charitable contribution substantiation letter for {{donorName}}'s donation.`

#### Step 6: Review Workflow
Your stepper now shows:
```
Stepper
─────────────
1 ● Collect Inputs
  │
2 ○ Validate Deductibility
  │
3 ○ Generate Substantiation Letter

[+ Add Step]
```

#### Step 7: Save Workflow
1. Click **Save** button at bottom of sidebar
2. Workflow is added to library
3. Returns to Home view
4. Your new workflow card appears!

---

## Example 3: Editing an Existing Workflow

### Scenario
You want to modify the R&D Credit Eligibility workflow to add an additional analysis step.

### Step-by-Step Walkthrough

#### Step 1: Find and Edit
1. Go to Workflows Library
2. Find **"R&D Credit Eligibility"** card
3. Click **✏️ Edit** button
4. Builder opens with existing workflow

#### Step 2: Review Current Steps
You see 5 steps in the stepper:
```
1 ● Collect Project Data
  │
2 ○ Extract Technical Details
  │
3 ○ Four-Part Test Analysis
  │
4 ○ Generate Eligibility Memo
  │
5 ○ Validate Citations
```

#### Step 3: Add New Step
1. Click on **Step 3** (Four-Part Test Analysis) to select it
2. Click **+ Add Step** button
3. Select **🔍 Run Analyses**
4. New step is added at the end

#### Step 4: Configure New Step
1. Click the step name field at top
2. Change to: `"Calculate Credit Amount"`
3. Go to **Tools** tab
4. Add tools:
   - `credit_calculator`
   - `expense_aggregator`
5. Go to **Prompt** tab
6. Enter:
   ```
   Calculate the R&D tax credit amount based on qualified 
   research expenses of {{expenses}} for project {{projectDescription}}.
   Include both regular credit and alternative simplified credit calculations.
   ```

#### Step 5: Reorder (Future Feature)
*Note: Currently steps are added at the end. In future versions, you'll be able to drag-and-drop to reorder.*

For now, the step order is:
```
1. Collect Project Data
2. Extract Technical Details
3. Four-Part Test Analysis
4. Generate Eligibility Memo
5. Validate Citations
6. Calculate Credit Amount  ← New step
```

#### Step 6: Save Changes
1. Click **Save** button
2. Workflow is updated
3. Returns to Home view
4. R&D Credit card shows updated "Last edited" date

---

## Example 4: Re-running a Failed Step

### Scenario
During workflow execution, Step 3 needs attention because of missing data. You need to fix and re-run it.

### Step-by-Step Walkthrough

#### Step 1: Run Workflow
1. Start the **Transfer Pricing Benchmark Summary** workflow
2. Complete Steps 1 and 2 successfully
3. Step 3 "Statistical Analysis" shows ⚠️ **Needs Attention**

#### Step 2: Review the Issue
1. Click on **Step 3** in the progress sidebar
2. Main area shows the step details
3. You see an error message or incomplete output

#### Step 3: Edit Inputs
1. Look at the input fields in the step
2. Notice "Transaction Type" is missing
3. Select: `Services`
4. Update "Transaction Amount": `250000`

#### Step 4: Re-run the Step
1. Click **🔄 Re-run Step** button
2. Step status changes to ⏳ Running
3. After processing, status changes to ✅ Done
4. New output appears:
   ```
   📊 Output
   ─────────────────────────────────
   Statistical Analysis Results
   
   Mean: $245,000
   Median: $250,000
   Interquartile Range: $220,000 - $280,000
   Your Transaction: $250,000 (Within range)
   ```

#### Step 5: Continue Workflow
1. Step 4 becomes active
2. Click **▶ Run Step**
3. Complete remaining steps
4. Click **Complete Workflow**

---

## Example 5: Using Search and Filters

### Scenario
You have many workflows and need to find all "Filing" related workflows.

### Step-by-Step Walkthrough

#### Step 1: Use Tag Filter
1. Go to Workflows Library
2. At the top, you see tag buttons:
   ```
   [All] [Research] [Review] [Filing] [Advisory]
   ```
3. Click **Filing** tag
4. Tag button highlights in purple
5. Only workflows with "Filing" tag are shown:
   - R&D Credit Eligibility
   - US-International Withholding Checklist

#### Step 2: Use Search
1. In the search box, type: `"withholding"`
2. Results filter in real-time
3. Only "US-International Withholding Checklist" appears

#### Step 3: Clear Filters
1. Click **All** tag to show all workflows
2. Clear search box to see everything

---

## Example 6: Understanding Step Types

### When to Use Each Step Type

#### 📝 Collect Inputs
**Use when:** You need to gather information from the user

**Example:**
```
Workflow: Client Intake
Step: Collect Client Information
Inputs:
  - clientName (text)
  - taxYear (number)
  - filingStatus (select)
  - hasW2 (boolean)
```

#### 🔄 Normalize Documents
**Use when:** You need to process uploaded files or transform data

**Example:**
```
Workflow: Tax Return Prep
Step: Extract W-2 Data
Tools: pdf_extractor, ocr_processor
Input: W-2 PDF files
Output: Structured wage data
```

#### 🔍 Run Analyses
**Use when:** You need to perform calculations or analysis

**Example:**
```
Workflow: AMT Calculation
Step: Calculate Alternative Minimum Tax
Tools: amt_calculator, preference_analyzer
Prompt: Calculate AMT for income of {{totalIncome}}
Output: AMT liability amount
```

#### ✍️ Assemble Draft
**Use when:** You need to generate documents or reports

**Example:**
```
Workflow: Audit Response
Step: Draft Response Letter
Tools: letter_generator, citation_formatter
Output: Formatted response document
```

#### ✅ QA & Citations
**Use when:** You need to validate or review output

**Example:**
```
Workflow: Research Memo
Step: Validate Tax Citations
Tools: citation_validator, bluebook_checker
Output: Validation report
```

---

## Example 7: Workflow Execution Flow

### Visual Flow Example

```
START
  ↓
┌─────────────────────┐
│ 1. Collect Inputs   │ ← User fills form
│    Status: Pending  │
│    [▶ Run Step]     │
└─────────────────────┘
  ↓ Click Run
┌─────────────────────┐
│ 1. Collect Inputs   │
│    Status: Running  │ ← Processing (2 sec)
│    ⏳               │
└─────────────────────┘
  ↓ Complete
┌─────────────────────┐
│ 1. Collect Inputs   │
│    Status: Done     │ ← Shows output
│    ✅               │
│    📊 Output: {...} │
└─────────────────────┘
  ↓ Auto-advance
┌─────────────────────┐
│ 2. Normalize Docs   │ ← Next step active
│    Status: Pending  │
│    [▶ Run Step]     │
└─────────────────────┘
  ↓ Continue...
```

---

## Example 8: Artifact Types Display

### How Different Outputs Appear

#### Table Artifact
```
📊 Output
─────────────────────────────────────────
State      | Nexus Status | Reason
─────────────────────────────────────────
California | Yes          | Physical presence
Texas      | Yes          | Economic nexus
Nevada     | No           | No activity
─────────────────────────────────────────
```

#### Draft Artifact
```
📄 Output
─────────────────────────────────────────
# Transfer Pricing Analysis

## Executive Summary
Based on our analysis of comparable 
transactions...

## Methodology
We applied the Comparable Uncontrolled 
Price (CUP) method...

## Findings
- Median price: $250,000
- Interquartile range: $220K - $280K
─────────────────────────────────────────
```

#### Data Artifact
```
📊 Output
─────────────────────────────────────────
{
  "businessActivities": "Software development",
  "states": ["CA", "TX"],
  "revenue": 5000000,
  "employees": 25
}
─────────────────────────────────────────
```

---

## Example 9: Complete Workflow Journey

### End-to-End: Entity Classification Memo

#### Phase 1: Setup (Builder)
1. Click **+ Create Workflow**
2. Name: "Entity Classification Analysis"
3. Add 5 steps:
   - Collect Entity Info
   - Review Formation Docs
   - Apply Check-the-Box Rules
   - Draft Classification Memo
   - Validate Citations

#### Phase 2: Execution (Runner)
1. Click **▶ Run** on the workflow
2. **Step 1**: Enter entity details
   - Entity Name: "Tech Innovations LLC"
   - Jurisdiction: "Delaware"
   - Owners: 2
   - Structure: "LLC"
3. **Step 2**: Upload formation documents
   - Operating Agreement PDF
   - Certificate of Formation
4. **Step 3**: Analysis runs automatically
   - Applies Reg §301.7701 rules
   - Generates classification table
5. **Step 4**: Draft memo generated
   - Professional format
   - Includes citations
   - Ready for review
6. **Step 5**: Citations validated
   - All references checked
   - Compliance verified

#### Phase 3: Review & Complete
1. Review all artifacts
2. Re-run Step 4 to adjust memo format
3. Click **Complete Workflow**
4. Workflow usage count increments

---

## 💡 Pro Tips

### Tip 1: Use Descriptive Names
```
❌ Bad:  "Step 1", "Analysis", "Check"
✅ Good: "Collect Client W-2 Data", "Calculate EITC Eligibility", "Validate SSN Format"
```

### Tip 2: Template Your Prompts
```
❌ Bad:  "Do the analysis"
✅ Good: "Analyze {{transactionType}} for {{clientName}} with amount {{amount}} under IRC §482"
```

### Tip 3: Tag Consistently
```
Use standard tags:
- Research: Legal research, case law
- Review: QA, validation, checking
- Filing: Return prep, forms
- Advisory: Planning, recommendations
```

### Tip 4: Build Incrementally
```
1. Start with 2-3 core steps
2. Test the workflow
3. Add refinement steps
4. Save and iterate
```

### Tip 5: Leverage Re-run
```
Don't start over!
- Adjust inputs
- Click Re-run
- Only that step re-executes
- Saves time
```

---

## 🎯 Common Workflows by Practice Area

### Individual Tax
- **EITC Eligibility Check**: Collect income → Verify qualifying child → Calculate credit
- **Itemized Deduction Analysis**: Collect expenses → Categorize → Compare to standard
- **Estimated Tax Calculator**: Collect income sources → Calculate liability → Generate vouchers

### Corporate Tax
- **NOL Carryforward Tracker**: Collect loss data → Apply limitations → Project utilization
- **Section 199A Deduction**: Collect business income → Test QBI → Calculate deduction
- **Book-Tax Reconciliation**: Import financials → Identify differences → Generate M-1

### International Tax
- **FBAR Filing Check**: Collect accounts → Test thresholds → Generate FinCEN 114
- **GILTI Calculation**: Collect CFC data → Calculate tested income → Apply deduction
- **Treaty Benefits Analysis**: Collect payment data → Review treaty → Determine withholding

### Transfer Pricing
- **Functional Analysis**: Document functions → Identify risks → Allocate assets
- **Benchmark Study**: Define transaction → Search comparables → Statistical analysis
- **Documentation Prep**: Collect data → Apply method → Generate report

---

## 📊 Workflow Metrics

### Understanding Usage Stats

```
Workflow Card Display:
┌─────────────────────────────┐
│ Nexus Check                 │
│ Determine state tax nexus   │
│ [Research] [Advisory]       │
│ 📊 12 runs  📅 2 days ago   │
│ [▶ Run] [✏️ Edit]          │
└─────────────────────────────┘

📊 12 runs = Used 12 times
📅 2 days ago = Last modified 2 days ago
```

---

## ✅ Quick Reference

### Workflow States
- **⭕ Pending**: Not started yet
- **⏳ Running**: Currently executing
- **✅ Done**: Completed successfully
- **⚠️ Needs Attention**: Requires user action

### Navigation
- **Home**: View all workflows
- **Builder**: Create/edit workflows
- **Runner**: Execute workflows

### Actions
- **Run**: Start workflow execution
- **Edit**: Modify workflow structure
- **Re-run**: Execute step again
- **Save**: Store workflow changes
- **Complete**: Finish workflow run

---

## 🚀 Getting Started Checklist

- [ ] Navigate to ⚙️ Workflows tab
- [ ] Explore the 5 seed templates
- [ ] Run the "Nexus Check" workflow
- [ ] Create a custom workflow
- [ ] Add steps and configure them
- [ ] Test your workflow
- [ ] Use search and filters
- [ ] Re-run a step
- [ ] Complete a full workflow

---

## 📝 Summary

The Workflows tab provides a **powerful automation framework** for multi-step tax analysis processes:

✅ **Pre-built templates** for common scenarios  
✅ **Visual builder** for custom workflows  
✅ **Step-by-step execution** with progress tracking  
✅ **Flexible re-run** capability  
✅ **Rich artifacts** (tables, drafts, data)  
✅ **Search and organization** tools  

**Start with a template, customize as needed, and automate your tax workflows!** 🎉
