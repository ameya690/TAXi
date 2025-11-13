import React, { useState } from 'react'

export default function BulkActions({ selectedCount, onAction }) {
  const [showMenu, setShowMenu] = useState(false)

  const actions = [
    {
      id: 'extract-terms',
      label: 'Extract Key Terms → Add to Table',
      icon: '🔍',
      description: 'Extract important terms and add to table artifact'
    },
    {
      id: 'share-matter',
      label: 'Share to Matter',
      icon: '📤',
      description: 'Share selected files to a specific matter'
    },
    {
      id: 'add-kb',
      label: 'Add to Knowledge Base',
      icon: '📚',
      description: 'Index files in knowledge base for search'
    },
    {
      id: 'download',
      label: 'Download Selected',
      icon: '⬇️',
      description: 'Download all selected files as ZIP'
    },
    {
      id: 'move',
      label: 'Move to Matter',
      icon: '📁',
      description: 'Move files to a different matter'
    },
    {
      id: 'delete',
      label: 'Delete Selected',
      icon: '🗑️',
      description: 'Permanently delete selected files',
      danger: true
    }
  ]

  const styles = {
    container: {
      background: 'white',
      borderRadius: '12px',
      border: '2px solid #667eea',
      padding: '16px 20px',
      marginBottom: '20px',
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
      boxShadow: '0 4px 12px rgba(102, 126, 234, 0.15)'
    },
    info: {
      flex: 1,
      display: 'flex',
      alignItems: 'center',
      gap: '12px'
    },
    count: {
      fontSize: '24px',
      fontWeight: '700',
      color: '#667eea'
    },
    text: {
      fontSize: '14px',
      color: '#64748b'
    },
    actions: {
      display: 'flex',
      gap: '8px',
      position: 'relative'
    },
    button: {
      padding: '10px 16px',
      border: 'none',
      borderRadius: '8px',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.2s',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    primaryButton: {
      background: '#667eea',
      color: 'white'
    },
    secondaryButton: {
      background: '#f1f5f9',
      color: '#475569'
    },
    menu: {
      position: 'absolute',
      top: '100%',
      right: 0,
      marginTop: '8px',
      background: 'white',
      borderRadius: '12px',
      boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
      border: '1px solid #e2e8f0',
      minWidth: '320px',
      zIndex: 100,
      overflow: 'hidden'
    },
    menuItem: {
      padding: '12px 16px',
      cursor: 'pointer',
      transition: 'all 0.2s',
      borderBottom: '1px solid #f1f5f9'
    },
    menuItemDanger: {
      borderTop: '2px solid #fee2e2'
    },
    menuItemHeader: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      marginBottom: '4px'
    },
    menuItemIcon: {
      fontSize: '20px'
    },
    menuItemLabel: {
      fontSize: '14px',
      fontWeight: '600',
      color: '#1e293b'
    },
    menuItemLabelDanger: {
      color: '#dc2626'
    },
    menuItemDescription: {
      fontSize: '12px',
      color: '#64748b',
      marginLeft: '32px'
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.info}>
        <div style={styles.count}>{selectedCount}</div>
        <div style={styles.text}>
          {selectedCount === 1 ? 'file selected' : 'files selected'}
        </div>
      </div>
      <div style={styles.actions}>
        <button
          style={{...styles.button, ...styles.primaryButton}}
          onClick={() => onAction('extract-terms')}
          onMouseOver={(e) => e.currentTarget.style.background = '#5568d3'}
          onMouseOut={(e) => e.currentTarget.style.background = '#667eea'}
        >
          🔍 Extract Key Terms
        </button>
        <button
          style={{...styles.button, ...styles.secondaryButton}}
          onClick={() => setShowMenu(!showMenu)}
          onMouseOver={(e) => e.currentTarget.style.background = '#e2e8f0'}
          onMouseOut={(e) => e.currentTarget.style.background = '#f1f5f9'}
        >
          More Actions ▼
        </button>

        {showMenu && (
          <>
            <div
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 99
              }}
              onClick={() => setShowMenu(false)}
            />
            <div style={styles.menu}>
              {actions.map(action => (
                <div
                  key={action.id}
                  style={{
                    ...styles.menuItem,
                    ...(action.danger ? styles.menuItemDanger : {})
                  }}
                  onClick={() => {
                    onAction(action.id)
                    setShowMenu(false)
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background = action.danger ? '#fef2f2' : '#f8fafc'
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = 'transparent'
                  }}
                >
                  <div style={styles.menuItemHeader}>
                    <span style={styles.menuItemIcon}>{action.icon}</span>
                    <span style={{
                      ...styles.menuItemLabel,
                      ...(action.danger ? styles.menuItemLabelDanger : {})
                    }}>
                      {action.label}
                    </span>
                  </div>
                  <div style={styles.menuItemDescription}>
                    {action.description}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
