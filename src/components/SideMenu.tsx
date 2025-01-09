import React from 'react';
import { LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

interface MenuItem {
  icon: React.ReactNode;
  label: string;
  path: string;
  active: boolean;
}

interface SideMenuProps {
  isOpen: boolean;
  menuItems: MenuItem[];
}

const SideMenu: React.FC<SideMenuProps> = ({ isOpen, menuItems }) => {
  const navigate = useNavigate();
  const [profile, setProfile] = React.useState<{ company?: string; full_name?: string } | null>(null);

  React.useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: customerData } = await supabase
          .from('customers')
          .select('name, company')
          .eq('email', user.email)
          .single();

        setProfile({
          company: customerData?.company || user.user_metadata?.company || 'HostCentral',
          full_name: customerData?.name || user.user_metadata?.full_name || user.email?.split('@')[0]
        });
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  return (
    <div
      className={`position-fixed h-100 start-0 bg-white shadow ${
        isOpen ? 'translate-middle-x-0' : 'translate-middle-x-100'
      } d-lg-block transition`}
      style={{ width: '250px', zIndex: 1030 }}
    >
      <div className="d-flex flex-column h-100">
        <div className="p-4 border-bottom">
          <h2 className="h4 mb-0 fw-bold">{profile?.company || 'HostCentral'}</h2>
          {profile?.full_name && (
            <p className="text-muted small mb-0 mt-1">Welcome, {profile.full_name}</p>
          )}
        </div>

        <nav className="flex-grow-1 py-3">
          {menuItems.map((item, index) => (
            <Link
              key={index}
              to={item.path}
              className={`d-flex align-items-center px-4 py-3 text-decoration-none ${
                item.active
                  ? 'text-primary bg-light border-end border-4 border-primary'
                  : 'text-body-secondary'
              }`}
            >
              {item.icon}
              <span className="ms-3">{item.label}</span>
            </Link>
          ))}
          
          <Link
            to="/add-trip"
            className="d-flex align-items-center px-4 py-3 text-decoration-none text-success"
          >
            <span className="ms-3">+ Add New Trip</span>
          </Link>
        </nav>

        <div className="p-4 border-top">
          <button 
            className="btn btn-link text-decoration-none text-body-secondary p-0 d-flex align-items-center"
            onClick={async () => {
              await supabase.auth.signOut();
              navigate('/login');
            }}
          >
            <LogOut size={20} />
            <span className="ms-3">Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default SideMenu;
