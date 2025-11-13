import React, { useState } from 'react'

export default function AccessControls({ onClose }) {
  const [activeTab, setActiveTab] = useState('permissions')

  const users = [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Editor', avatar: '👤' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'Viewer', avatar: '👤' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'Editor', avatar: '👤' }
  ]

  const auditLog = [
    { id: 1, user: 'John Doe', action: 'Uploaded', file: 'W-2 Forms.pdf', timestamp: '2024-11-10 14:30' },
    { id: 2, user: 'Jane Smith', action: 'Viewed', file: 'Transfer Pricing Study.docx', timestamp: '2024-11-10 13:15' },
    { id: 3, user: 'Bob Johnson', action: 'Downloaded', file: 'IRS Notice.pdf', timestamp: '2024-11-10 11:45' },
    { id: 4, user: 'John Doe', action: 'Shared', file: 'W-2 Forms.pdf', timestamp: '2024-11-10 10:20' }
  ]

  const styles = {
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    },
    modal: {
      background: 'white',
      borderRadius: '16px',
      width: '90%',
      maxWidth: '800px',
      maxHeight: '90vh',
      display: 'flex',
      flexDirection: 'column',
      boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
    },
    header: {
      padding: '24px',
      borderBottom: '1px solid #e2e8f0',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    title: {
      fontSize: '24px',
      fontWeight: '700',
      color: '#1e293b'
    },
    closeButton: {
      background: 'none',
      border: 'none',
      fontSize: '24px',
      cursor: 'pointer',
      color: '#94a3b8',
      padding: '4px'
    },
    tabs: {
      display: 'flex',
      padding: '0 24px',
      borderBottom: '1px solid #e2e8f0',
      gap: '8px'
    },
    tab: {
      padding: '12px 20px',
      border: 'none',
      background: 'transparent',
      fontSize: '14px',
      fontWeight: '600',
      color: '#64748b',
      cursor: 'pointer',
      borderBottom: '2px solid transparent',
      marginBottom: '-1px',
      transition: 'all 0.2s'
    },
    tabActive: {
      color: '#667eea',
      borderBottomColor: '#667eea'
    },
    content: {
      flex: 1,
      overflow: 'auto',
      padding: '24px'
    },
    section: {
      marginBottom: '24px'
    },
    sectionTitle: {
      fontSize: '16px',
      fontWeight: '600',
      color: '#1e293b',
      marginBottom: '16px'
    },
    userList: {
      display: 'flex',
      flexDirection: 'column',
      gap: '12px'
    },
    userItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '12px',
      background: '#f8fafc',
      borderRadius: '8px',
      border: '1px solid #e2e8f0'
    },
    avatar: {
      width: '40px',
      height: '40px',
      borderRadius: '50%',
      background: '#667eea',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '20px'
    },
    userInfo: {
      flex: 1
    },
    userName: {
      fontSize: '14px',
      fontWeight: '600',
      color: '#1e293b'
    },
    userEmail: {
      fontSize: '12px',
      color: '#64748b'
    },
    roleSelect: {
      padding: '8px 12px',
      border: '1px solid #e2e8f0',
      borderRadius: '6px',
      fontSize: '13px',
      fontWeight: '600',
      cursor: 'pointer'
    },
    addButton: {
      width: '100%',
      padding: '12px',
      border: '2px dashed #cbd5e1',
      borderRadius: '8px',
      background: 'transparent',
      color: '#667eea',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer'
    },
    auditTable: {
      width: '100%',
      borderCollapse: 'collapse'
    },
    th: {
      textAlign: 'left',
      padding: '12px',
      background: '#f8fafc',
      fontSize: '13px',
      fontWeight: '600',
      color: '#475569',
      borderBottom: '2px solid #e2e8f0'
    },
    td: {
      padding: '12px',
      borderBottom: '1px solid #f1f5f9',
      fontSize: '14px',
      color: '#1e293b'
    },
    actionBadge: {
      padding: '4px 12px',
      borderRadius: '12px',
      fontSize: '12px',
      fontWeight: '600'
    },
    uploadBadge: {
      background: '#dcfce7',
      color: '#166534'
    },
    viewBadge: {
      background: '#dbeafe',
      color: '#1e40af'
    },
    downloadBadge: {
      background: '#fef3c7',
      color: '#92400e'
    },
    shareBadge: {
      background: '#f3e8ff',
      color: '#6b21a8'
    },
    stub: {
      padding: '40px',
      textAlign: 'center',
      background: '#f8fafc',
      borderRadius: '8px',
      border: '2px dashed #cbd5e1'
    },
    stubIcon: {
      fontSize: '48px',
      marginBottom: '12px'
    },
    stubText: {
      fontSize: '14px',
      color: '#64748b'
    }
  }

  const getActionBadgeStyle = (action) => {
    const map = {
      'Uploaded': styles.uploadBadge,
      'Viewed': styles.viewBadge,
      'Downloaded': styles.downloadBadge,
      'Shared': styles.shareBadge
    }
    return { ...styles.actionBadge, ...(map[action] || {}) }
  }

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div style={styles.header}>
          <div style={styles.title}>🔒 Access Controls</div>
          <button style={styles.closeButton} onClick={onClose}>×</button>
        </div>

        <div style={styles.tabs}>
          <button
            style={{
              ...styles.tab,
              ...(activeTab === 'permissions' ? styles.tabActive : {})
            }}
            onClick={() => setActiveTab('permissions')}
          >
            Permissions
          </button>
          <button
            style={{
              ...styles.tab,
              ...(activeTab === 'audit' ? styles.tabActive : {})
            }}
            onClick={() => setActiveTab('audit')}
          >
            Audit Log
          </button>
        </div>

        <div style={styles.content}>
          {activeTab === 'permissions' && (
            <>
              <div style={styles.section}>
                <div style={styles.sectionTitle}>Users with Access</div>
                <div style={styles.userList}>
                  {users.map(user => (
                    <div key={user.id} style={styles.userItem}>
                      <div style={styles.avatar}>{user.avatar}</div>
                      <div style={styles.userInfo}>
                        <div style={styles.userName}>{user.name}</div>
                        <div style={styles.userEmail}>{user.email}</div>
                      </div>
                      <select style={styles.roleSelect} defaultValue={user.role}>
                        <option value="Viewer">Viewer</option>
                        <option value="Editor">Editor</option>
                        <option value="Admin">Admin</option>
                      </select>
                    </div>
                  ))}
                </div>
                <button
                  style={styles.addButton}
                  onMouseOver={(e) => {
                    e.currentTarget.style.borderColor = '#667eea'
                    e.currentTarget.style.background = '#f0f4ff'
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.borderColor = '#cbd5e1'
                    e.currentTarget.style.background = 'transparent'
                  }}
                >
                  + Add User
                </button>
              </div>

              <div style={styles.section}>
                <div style={styles.sectionTitle}>Permission Levels</div>
                <div style={styles.stub}>
                  <div style={styles.stubIcon}>🔐</div>
                  <div style={styles.stubText}>
                    Advanced permission settings will be available here
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'audit' && (
            <div style={styles.section}>
              <div style={styles.sectionTitle}>Recent Activity</div>
              <table style={styles.auditTable}>
                <thead>
                  <tr>
                    <th style={styles.th}>User</th>
                    <th style={styles.th}>Action</th>
                    <th style={styles.th}>File</th>
                    <th style={styles.th}>Timestamp</th>
                  </tr>
                </thead>
                <tbody>
                  {auditLog.map(entry => (
                    <tr key={entry.id}>
                      <td style={styles.td}>{entry.user}</td>
                      <td style={styles.td}>
                        <span style={getActionBadgeStyle(entry.action)}>
                          {entry.action}
                        </span>
                      </td>
                      <td style={styles.td}>{entry.file}</td>
                      <td style={styles.td}>{entry.timestamp}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div style={{ marginTop: '20px', textAlign: 'center' }}>
                <button
                  style={{
                    padding: '10px 20px',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    background: 'white',
                    color: '#667eea',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.background = '#f8fafc'}
                  onMouseOut={(e) => e.currentTarget.style.background = 'white'}
                >
                  View Full Audit Log →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
