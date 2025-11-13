# Table Tool Guide

## ✅ Fixed! Table Tool Now Works Properly

The table tool now actually parses the LLM's response and creates real tables based on your document content.

## 🎯 How It Works Now

### Before (Broken)
- Showed hardcoded placeholder table
- Ignored your question
- Always showed EITC income ranges

### After (Fixed)
- ✅ Parses LLM response for markdown tables
- ✅ Extracts actual data from your documents
- ✅ Creates custom tables based on your request
- ✅ Handles various table formats

## 📊 How to Use the Table Tool

### Basic Syntax
```
/table [Your request]
```

### Examples with IRS Notice

**1. Timeline of Key Dates**
```
/table Create a timeline of key dates mentioned in the IRS notice
```

Expected output:
| Date | Event | Action Required |
|------|-------|-----------------|
| Jan 15, 2024 | Notice Issued | Review notice |
| Feb 15, 2024 | Response Due | Submit documentation |
| Mar 1, 2024 | Hearing Date | Attend hearing |

**2. Amount Breakdown**
```
/table Extract all amounts mentioned with their descriptions
```

Expected output:
| Description | Amount | Status |
|-------------|--------|--------|
| Tax Owed | $5,432.00 | Outstanding |
| Penalties | $543.20 | Outstanding |
| Interest | $123.45 | Accruing |
| Total Due | $6,098.65 | Pay by Feb 15 |

**3. Contact Information**
```
/table List all contact information and phone numbers
```

Expected output:
| Contact Type | Name/Department | Phone | Hours |
|--------------|-----------------|-------|-------|
| Agent | John Smith | (555) 123-4567 | M-F 8-5 |
| Supervisor | Jane Doe | (555) 123-4568 | M-F 9-4 |
| General Line | IRS Help | 1-800-829-1040 | M-F 7-7 |

### Examples with Tax Returns

**4. Income Sources**
```
/table Summarize all income sources with amounts
```

**5. Deductions**
```
/table Create a table of all deductions by category
```

**6. Year-over-Year Comparison**
```
/table Compare income and deductions from 2022 and 2023
```

### Examples with Contracts

**7. Payment Schedule**
```
/table Extract the payment schedule with dates and amounts
```

**8. Deliverables**
```
/table List all deliverables, due dates, and responsible parties
```

**9. Terms and Conditions**
```
/table Summarize key terms including duration, termination, and renewal
```

## 💡 Pro Tips

### 1. Be Specific About Columns
```
❌ /table Show me the dates
✅ /table Create a table with columns: Date, Event, Deadline, Action Required
```

### 2. Specify What to Extract
```
❌ /table Make a table
✅ /table Extract all monetary amounts with their descriptions and due dates
```

### 3. Request Sorting
```
✅ /table List all expenses sorted by amount (highest to lowest)
```

### 4. Ask for Calculations
```
✅ /table Show quarterly income with totals for each quarter
```

## 🔧 How It Works Technically

1. **You type:** `/table Create a timeline of key dates`
2. **Backend adds:** Special prompt asking for markdown table format
3. **LLM generates:** Proper markdown table with | separators
4. **Parser extracts:** Columns and rows from markdown
5. **Frontend displays:** Formatted table in the UI

## 📝 Markdown Table Format

The LLM is instructed to respond in this format:

```markdown
| Header 1 | Header 2 | Header 3 |
|----------|----------|----------|
| Data 1   | Data 2   | Data 3   |
| Data 4   | Data 5   | Data 6   |
```

The parser then converts this to a structured table.

## ⚠️ Troubleshooting

### Table Shows "No data extracted"
**Cause:** LLM didn't format response as a table
**Solution:** Try rephrasing your request to be more specific

### Table Has Wrong Data
**Cause:** LLM misunderstood the request
**Solution:** Be more specific about what to extract

### Table Is Too Wide
**Cause:** Too many columns requested
**Solution:** Ask for fewer columns or split into multiple tables

### Empty Cells
**Cause:** Information not found in document
**Solution:** Normal - means that data point wasn't in the document

## 🎯 Best Practices

### DO:
- ✅ Upload your document first
- ✅ Be specific about columns
- ✅ Ask for data that's actually in the document
- ✅ Use clear, descriptive column names
- ✅ Request sorting or grouping if needed

### DON'T:
- ❌ Ask for data not in the document
- ❌ Request too many columns (>6)
- ❌ Use vague descriptions
- ❌ Forget to upload the document first

## 🚀 Advanced Examples

### Multi-Document Comparison
```
/table Compare key terms across all three contracts: parties, duration, payment terms, and termination clauses
```

### Calculated Fields
```
/table Show all expenses with amounts, calculate subtotals by category, and grand total
```

### Conditional Extraction
```
/table List only transactions over $1,000 with date, description, and amount
```

### Grouped Data
```
/table Group all income by source type (W-2, 1099, Investment) with subtotals
```

## 📊 Sample Use Cases

### Tax Professional
- Extract client information from multiple returns
- Compare deductions year-over-year
- Create audit trail of key dates
- Summarize tax positions

### Legal Review
- Extract contract terms
- Compare multiple agreements
- Timeline of obligations
- Payment schedules

### Financial Analysis
- Income statement summary
- Expense categorization
- Cash flow timeline
- Budget vs actual comparison

## ✨ Try It Now!

1. **Upload your IRS notice or tax document**
2. **Type:** `/table Create a timeline of key dates mentioned`
3. **See:** A properly formatted table with actual data from your document!

The table tool is now fully functional and will create custom tables based on your specific requests! 🎉
