import React, { useState, useEffect } from 'react';
import { User, Shield, Moon, Sun, Mail, Key, Upload, Phone, MapPin, Calendar, Building } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface UserProfile {
  email: string;
  username: string;
  avatar_url?: string;
  full_name?: string;
  phone?: string;
  address?: string;
  company?: string;
  role?: string;
  joined_date?: string;
  department?: string;
}

const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [editMode, setEditMode] = useState(false);
  const [editForm, setEditForm] = useState<UserProfile | null>(null);

  useEffect(() => {
    fetchUserProfile();
    const savedTheme = localStorage.getItem('theme');
    setIsDarkMode(savedTheme === 'dark');
    document.documentElement.classList.toggle('dark-mode', savedTheme === 'dark');
  }, []);

  const fetchUserProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Fetch additional user details from your customers table
        const { data: customerData, error: customerError } = await supabase
          .from('customers')
          .select('*')
          .eq('email', user.email)
          .single();

        if (customerError && customerError.code !== 'PGRST116') {
          console.error('Error fetching customer data:', customerError);
        }

        const profileData = {
          email: user.email || '',
          username: user.user_metadata?.username || user.email?.split('@')[0] || '',
          avatar_url: user.user_metadata?.avatar_url,
          full_name: customerData?.name || user.user_metadata?.full_name || '',
          phone: customerData?.phone || user.user_metadata?.phone || '',
          address: customerData?.address || user.user_metadata?.address || '',
          company: customerData?.company || user.user_metadata?.company || 'HostCentral',
          role: customerData?.role || user.user_metadata?.role || 'User',
          joined_date: customerData?.created_at || user.created_at,
          department: customerData?.department || user.user_metadata?.department || ''
        };

        setProfile(profileData);
        setEditForm(profileData);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingAvatar(true);
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('profiles')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('profiles')
        .getPublicUrl(filePath);

      const { error: updateError } = await supabase.auth.updateUser({
        data: { avatar_url: publicUrl }
      });

      if (updateError) throw updateError;

      setProfile(prev => prev ? { ...prev, avatar_url: publicUrl } : null);
      setEditForm(prev => prev ? { ...prev, avatar_url: publicUrl } : null);
    } catch (error) {
      console.error('Error uploading avatar:', error);
      alert('Error uploading avatar. Please try again.');
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleThemeToggle = () => {
    const newTheme = !isDarkMode ? 'dark' : 'light';
    setIsDarkMode(!isDarkMode);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark-mode', !isDarkMode);
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert('New passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: passwordForm.newPassword
      });

      if (error) throw error;
      alert('Password updated successfully');
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      console.error('Error updating password:', error);
      alert('Error updating password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async () => {
    if (!editForm) return;

    setLoading(true);
    try {
      const { error: updateError } = await supabase.auth.updateUser({
        data: {
          username: editForm.username,
          full_name: editForm.full_name,
          phone: editForm.phone,
          address: editForm.address,
          company: editForm.company,
          role: editForm.role,
          department: editForm.department
        }
      });

      if (updateError) throw updateError;

      setProfile(editForm);
      setEditMode(false);
      alert('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Error updating profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid px-4">
      <h1 className="h3 mb-4">Settings</h1>

      <div className="row">
        <div className="col-12 col-md-3 mb-4">
          <div className="card">
            <div className="list-group list-group-flush">
              <button
                className={`list-group-item list-group-item-action d-flex align-items-center gap-2 ${activeTab === 'profile' ? 'active' : ''}`}
                onClick={() => setActiveTab('profile')}
              >
                <User size={20} />
                Profile
              </button>
              <button
                className={`list-group-item list-group-item-action d-flex align-items-center gap-2 ${activeTab === 'security' ? 'active' : ''}`}
                onClick={() => setActiveTab('security')}
              >
                <Shield size={20} />
                Security
              </button>
              <button
                className={`list-group-item list-group-item-action d-flex align-items-center gap-2 ${activeTab === 'preferences' ? 'active' : ''}`}
                onClick={() => setActiveTab('preferences')}
              >
                {isDarkMode ? <Moon size={20} /> : <Sun size={20} />}
                Preferences
              </button>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-9">
          <div className="card">
            <div className="card-body">
              {activeTab === 'profile' && (
                <div>
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h4 className="card-title mb-0">Profile Information</h4>
                    <button
                      className="btn btn-outline-primary d-inline-flex align-items-center gap-2"
                      onClick={() => {
                        if (editMode) {
                          handleProfileUpdate();
                        } else {
                          setEditMode(true);
                        }
                      }}
                      disabled={loading}
                    >
                      {editMode ? (
                        <>
                          <Key size={20} />
                          Save Changes
                        </>
                      ) : (
                        <>
                          <User size={20} />
                          Edit Profile
                        </>
                      )}
                    </button>
                  </div>

                  <div className="mb-4">
                    <div className="d-flex align-items-center gap-3 mb-4">
                      <div className="position-relative">
                        <div className="rounded-circle bg-secondary text-white d-flex align-items-center justify-content-center" style={{ width: '100px', height: '100px' }}>
                          {profile?.avatar_url ? (
                            <img 
                              src={profile.avatar_url} 
                              alt="Profile" 
                              className="rounded-circle" 
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                            />
                          ) : (
                            <User size={50} />
                          )}
                        </div>
                        <label className="position-absolute bottom-0 end-0 bg-primary rounded-circle p-2 cursor-pointer" style={{ cursor: 'pointer' }}>
                          <input
                            type="file"
                            className="d-none"
                            accept="image/*"
                            onChange={handleAvatarUpload}
                            disabled={uploadingAvatar}
                          />
                          <Upload size={16} className="text-white" />
                        </label>
                      </div>
                      <div>
                        <h5 className="mb-1">{profile?.full_name || profile?.username}</h5>
                        <p className="text-muted mb-0 d-flex align-items-center gap-2">
                          <Mail size={16} />
                          {profile?.email}
                        </p>
                        {profile?.role && (
                          <p className="text-muted mb-0 mt-1">
                            <span className="badge bg-primary">{profile.role}</span>
                          </p>
                        )}
                      </div>
                    </div>

                    {editMode ? (
                      <div className="row g-3">
                        <div className="col-md-6">
                          <label className="form-label">Full Name</label>
                          <input
                            type="text"
                            className="form-control"
                            value={editForm?.full_name || ''}
                            onChange={e => setEditForm(prev => prev ? { ...prev, full_name: e.target.value } : null)}
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">Username</label>
                          <input
                            type="text"
                            className="form-control"
                            value={editForm?.username || ''}
                            onChange={e => setEditForm(prev => prev ? { ...prev, username: e.target.value } : null)}
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">Phone</label>
                          <input
                            type="tel"
                            className="form-control"
                            value={editForm?.phone || ''}
                            onChange={e => setEditForm(prev => prev ? { ...prev, phone: e.target.value } : null)}
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">Company</label>
                          <input
                            type="text"
                            className="form-control"
                            value={editForm?.company || ''}
                            onChange={e => setEditForm(prev => prev ? { ...prev, company: e.target.value } : null)}
                          />
                        </div>
                        <div className="col-12">
                          <label className="form-label">Address</label>
                          <input
                            type="text"
                            className="form-control"
                            value={editForm?.address || ''}
                            onChange={e => setEditForm(prev => prev ? { ...prev, address: e.target.value } : null)}
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">Department</label>
                          <input
                            type="text"
                            className="form-control"
                            value={editForm?.department || ''}
                            onChange={e => setEditForm(prev => prev ? { ...prev, department: e.target.value } : null)}
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="row g-3">
                        <div className="col-md-6">
                          <div className="d-flex align-items-center gap-2 text-muted">
                            <Phone size={16} />
                            {profile?.phone || 'No phone number'}
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="d-flex align-items-center gap-2 text-muted">
                            <Building size={16} />
                            {profile?.company || 'HostCentral'}
                          </div>
                        </div>
                        {profile?.address && (
                          <div className="col-12">
                            <div className="d-flex align-items-center gap-2 text-muted">
                              <MapPin size={16} />
                              {profile.address}
                            </div>
                          </div>
                        )}
                        {profile?.department && (
                          <div className="col-md-6">
                            <div className="d-flex align-items-center gap-2 text-muted">
                              <Building size={16} />
                              {profile.department}
                            </div>
                          </div>
                        )}
                        {profile?.joined_date && (
                          <div className="col-md-6">
                            <div className="d-flex align-items-center gap-2 text-muted">
                              <Calendar size={16} />
                              Joined {new Date(profile.joined_date).toLocaleDateString()}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'security' && (
                <div>
                  <h4 className="card-title mb-4">Security Settings</h4>
                  <form onSubmit={handlePasswordChange} className="max-w-md">
                    <div className="mb-3">
                      <label className="form-label">Current Password</label>
                      <input
                        type="password"
                        className="form-control"
                        value={passwordForm.currentPassword}
                        onChange={e => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">New Password</label>
                      <input
                        type="password"
                        className="form-control"
                        value={passwordForm.newPassword}
                        onChange={e => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Confirm New Password</label>
                      <input
                        type="password"
                        className="form-control"
                        value={passwordForm.confirmPassword}
                        onChange={e => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                        required
                      />
                    </div>
                    <button 
                      type="submit" 
                      className="btn btn-primary d-inline-flex align-items-center gap-2"
                      disabled={loading}
                    >
                      <Key size={20} />
                      {loading ? 'Updating Password...' : 'Update Password'}
                      {loading && <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>}
                    </button>
                  </form>
                </div>
              )}

              {activeTab === 'preferences' && (
                <div>
                  <h4 className="card-title mb-4">Preferences</h4>
                  <div className="mb-3">
                    <label className="form-label d-flex justify-content-between align-items-center">
                      <span>Theme Mode</span>
                      <button
                        className="btn btn-outline-primary d-inline-flex align-items-center gap-2"
                        onClick={handleThemeToggle}
                      >
                        {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                        {isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                      </button>
                    </label>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
