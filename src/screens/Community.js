import React, { memo, useState, useCallback, useMemo } from 'react';
import { theme } from '../styles/theme';
import { Card, Button, Modal, InputForm } from '../components';

const Community = memo(({ showToast, setIsLoading }) => {
  const [posts, setPosts] = useState([
    {
      id: 1,
      author: 'יוסי גרין',
      avatar: '👨‍🌾',
      title: 'קציר ראשון של עגבניות שרי!',
      content: 'אחרי 3 חודשים של גידול, סוף סוף קצרתי את העגבניות הראשונות. הטעם מדהים! המערכת NFT עבדה בצורה מושלמת.',
      image: '🍅',
      timestamp: '2024-01-25 14:30',
      likes: 24,
      comments: [
        { id: 1, author: 'שרה כהן', content: 'נראה מדהים! איזה זן השתמשת?', timestamp: '2024-01-25 15:00' },
        { id: 2, author: 'דוד לוי', content: 'כמה זמן לקח עד לפריחה?', timestamp: '2024-01-25 16:15' }
      ],
      tags: ['עגבניות', 'NFT', 'קציר']
    },
    {
      id: 2,
      author: 'מיכל פרחים',
      avatar: '👩‍🌾',
      title: 'בעיה עם רמת pH - עזרה דחופה!',
      content: 'ה-pH במערכת שלי קפץ ל-8.2 ואני לא יודעת למה. הצמחים מתחילים להצהיב. מישהו נתקל בבעיה דומה?',
      image: '📊',
      timestamp: '2024-01-25 10:15',
      likes: 8,
      comments: [
        { id: 3, author: 'אבי מומחה', content: 'בדקי את איכות המים. יכול להיות שהברז השתנה', timestamp: '2024-01-25 10:45' },
        { id: 4, author: 'רונית ירוק', content: 'קרה לי אותו דבר. תוסיפי pH Down בהדרגה', timestamp: '2024-01-25 11:20' }
      ],
      tags: ['pH', 'בעיות', 'עזרה']
    },
    {
      id: 3,
      author: 'אלי טכנולוג',
      avatar: '👨‍💻',
      title: 'מערכת חיישנים DIY חדשה',
      content: 'בניתי מערכת חיישנים עם Arduino שמודדת pH, EC וטמפרטורה ושולחת התראות לטלפון. מישהו מעוניין בהוראות הרכבה?',
      image: '🔧',
      timestamp: '2024-01-24 20:00',
      likes: 45,
      comments: [
        { id: 5, author: 'תומר גיק', content: 'בהחלט מעוניין! תוכל לשתף את הקוד?', timestamp: '2024-01-24 20:30' },
        { id: 6, author: 'לינה חכמה', content: 'איזה חיישנים השתמשת? נראה מקצועי', timestamp: '2024-01-24 21:00' }
      ],
      tags: ['טכנולוגיה', 'DIY', 'חיישנים']
    }
  ]);
  
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    tags: ''
  });
  const [newComment, setNewComment] = useState('');
  const [filterTag, setFilterTag] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  
  const allTags = useMemo(() => {
    const tags = new Set();
    posts.forEach(post => {
      post.tags.forEach(tag => tags.add(tag));
    });
    return Array.from(tags);
  }, [posts]);
  
  const filteredAndSortedPosts = useMemo(() => {
    let filtered = posts;
    
    if (filterTag !== 'all') {
      filtered = posts.filter(post => post.tags.includes(filterTag));
    }
    
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'recent':
          return new Date(b.timestamp) - new Date(a.timestamp);
        case 'likes':
          return b.likes - a.likes;
        case 'comments':
          return b.comments.length - a.comments.length;
        default:
          return 0;
      }
    });
  }, [posts, filterTag, sortBy]);
  
  const handleCreatePost = useCallback(() => {
    if (!newPost.title || !newPost.content) {
      showToast('אנא מלא כותרת ותוכן', 'error');
      return;
    }
    
    setIsLoading(true);
    
    setTimeout(() => {
      const post = {
        id: Date.now(),
        author: 'אתה',
        avatar: '🙋‍♂️',
        title: newPost.title,
        content: newPost.content,
        image: '📝',
        timestamp: new Date().toISOString().slice(0, 16).replace('T', ' '),
        likes: 0,
        comments: [],
        tags: newPost.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
      };
      
      setPosts(prev => [post, ...prev]);
      setNewPost({ title: '', content: '', tags: '' });
      setIsPostModalOpen(false);
      setIsLoading(false);
      showToast('פוסט חדש נוצר בהצלחה!', 'success');
    }, 1000);
  }, [newPost, showToast, setIsLoading]);
  
  const handleLike = useCallback((postId) => {
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { ...post, likes: post.likes + 1 }
        : post
    ));
    showToast('לייק נוסף!', 'success');
  }, [showToast]);
  
  const handleComment = useCallback((postId) => {
    if (!newComment.trim()) {
      showToast('אנא כתוב תגובה', 'error');
      return;
    }
    
    const comment = {
      id: Date.now(),
      author: 'אתה',
      content: newComment,
      timestamp: new Date().toISOString().slice(0, 16).replace('T', ' ')
    };
    
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { ...post, comments: [...post.comments, comment] }
        : post
    ));
    
    setNewComment('');
    setIsCommentModalOpen(false);
    showToast('תגובה נוספה בהצלחה!', 'success');
  }, [newComment, showToast]);
  
  const openCommentModal = useCallback((post) => {
    setSelectedPost(post);
    setIsCommentModalOpen(true);
  }, []);
  
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'לפני פחות משעה';
    if (diffInHours < 24) return `לפני ${diffInHours} שעות`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `לפני ${diffInDays} ימים`;
    return date.toLocaleDateString('he-IL');
  };
  
  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
    flexWrap: 'wrap',
    gap: theme.spacing.md
  };
  
  const filtersStyle = {
    display: 'flex',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.lg,
    flexWrap: 'wrap',
    alignItems: 'center'
  };
  
  const selectStyle = {
    padding: theme.spacing.sm,
    border: `2px solid ${theme.colors.secondary[300]}`,
    borderRadius: theme.borderRadius.md,
    fontSize: theme.typography.fontSize.sm,
    backgroundColor: theme.colors.background.default
  };
  
  const postsListStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing.lg
  };
  
  const postHeaderStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.md
  };
  
  const avatarStyle = {
    width: '48px',
    height: '48px',
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.primary[100],
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: theme.typography.fontSize.xl
  };
  
  const authorInfoStyle = {
    flex: 1
  };
  
  const authorNameStyle = {
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.primary,
    margin: 0
  };
  
  const timestampStyle = {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    margin: 0
  };
  
  const postTitleStyle = {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm
  };
  
  const postContentStyle = {
    lineHeight: theme.typography.lineHeight.relaxed,
    marginBottom: theme.spacing.md,
    color: theme.colors.text.primary
  };
  
  const postImageStyle = {
    fontSize: '4rem',
    textAlign: 'center',
    marginBottom: theme.spacing.md,
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.background.paper,
    borderRadius: theme.borderRadius.md
  };
  
  const tagsStyle = {
    display: 'flex',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.md,
    flexWrap: 'wrap'
  };
  
  const tagStyle = {
    padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
    backgroundColor: theme.colors.primary[100],
    color: theme.colors.primary.main,
    borderRadius: theme.borderRadius.md,
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.medium
  };
  
  const postActionsStyle = {
    display: 'flex',
    gap: theme.spacing.md,
    paddingTop: theme.spacing.md,
    borderTop: `1px solid ${theme.colors.secondary[200]}`
  };
  
  const actionButtonStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.xs,
    background: 'none',
    border: 'none',
    color: theme.colors.text.secondary,
    cursor: 'pointer',
    fontSize: theme.typography.fontSize.sm,
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.sm,
    transition: `all ${theme.transitions.fast}`,
    ':hover': {
      backgroundColor: theme.colors.secondary[100],
      color: theme.colors.text.primary
    }
  };
  
  const commentsStyle = {
    marginTop: theme.spacing.md,
    paddingTop: theme.spacing.md,
    borderTop: `1px solid ${theme.colors.secondary[200]}`
  };
  
  const commentStyle = {
    display: 'flex',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
    padding: theme.spacing.sm,
    backgroundColor: theme.colors.background.paper,
    borderRadius: theme.borderRadius.md
  };
  
  const commentAuthorStyle = {
    fontWeight: theme.typography.fontWeight.semibold,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.primary.main
  };
  
  const commentContentStyle = {
    fontSize: theme.typography.fontSize.sm,
    marginTop: theme.spacing.xs
  };
  
  const commentTimestampStyle = {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.xs
  };
  
  return (
    <div>
      <div style={headerStyle}>
        <h2 style={{ margin: 0, fontSize: theme.typography.fontSize['2xl'] }}>
          👥 קהילת מגדלים
        </h2>
        <Button variant="primary" onClick={() => setIsPostModalOpen(true)}>
          ✍️ כתוב פוסט חדש
        </Button>
      </div>
      
      <div style={filtersStyle}>
        <span style={{ fontWeight: theme.typography.fontWeight.medium }}>סינון:</span>
        
        <select 
          style={selectStyle}
          value={filterTag}
          onChange={(e) => setFilterTag(e.target.value)}
        >
          <option value="all">כל הנושאים</option>
          {allTags.map(tag => (
            <option key={tag} value={tag}>{tag}</option>
          ))}
        </select>
        
        <span style={{ fontWeight: theme.typography.fontWeight.medium }}>מיון:</span>
        
        <select 
          style={selectStyle}
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="recent">הכי חדשים</option>
          <option value="likes">הכי פופולריים</option>
          <option value="comments">הכי מתגובבים</option>
        </select>
      </div>
      
      <div style={postsListStyle}>
        {filteredAndSortedPosts.map(post => (
          <Card key={post.id}>
            <div style={postHeaderStyle}>
              <div style={avatarStyle}>
                {post.avatar}
              </div>
              <div style={authorInfoStyle}>
                <p style={authorNameStyle}>{post.author}</p>
                <p style={timestampStyle}>{formatTimestamp(post.timestamp)}</p>
              </div>
            </div>
            
            <h3 style={postTitleStyle}>{post.title}</h3>
            
            <p style={postContentStyle}>{post.content}</p>
            
            <div style={postImageStyle}>
              {post.image}
            </div>
            
            <div style={tagsStyle}>
              {post.tags.map(tag => (
                <span key={tag} style={tagStyle}>#{tag}</span>
              ))}
            </div>
            
            <div style={postActionsStyle}>
              <button 
                style={actionButtonStyle}
                onClick={() => handleLike(post.id)}
              >
                <span>👍</span>
                <span>{post.likes} לייקים</span>
              </button>
              
              <button 
                style={actionButtonStyle}
                onClick={() => openCommentModal(post)}
              >
                <span>💬</span>
                <span>{post.comments.length} תגובות</span>
              </button>
              
              <button style={actionButtonStyle}>
                <span>📤</span>
                <span>שתף</span>
              </button>
            </div>
            
            {post.comments.length > 0 && (
              <div style={commentsStyle}>
                <h4 style={{ 
                  fontSize: theme.typography.fontSize.lg,
                  marginBottom: theme.spacing.md,
                  color: theme.colors.text.primary
                }}>
                  תגובות:
                </h4>
                {post.comments.slice(0, 2).map(comment => (
                  <div key={comment.id} style={commentStyle}>
                    <div>
                      <div style={commentAuthorStyle}>{comment.author}</div>
                      <div style={commentContentStyle}>{comment.content}</div>
                      <div style={commentTimestampStyle}>
                        {formatTimestamp(comment.timestamp)}
                      </div>
                    </div>
                  </div>
                ))}
                {post.comments.length > 2 && (
                  <Button 
                    variant="ghost" 
                    size="small"
                    onClick={() => openCommentModal(post)}
                  >
                    הצג עוד {post.comments.length - 2} תגובות...
                  </Button>
                )}
              </div>
            )}
          </Card>
        ))}
      </div>
      
      {filteredAndSortedPosts.length === 0 && (
        <Card>
          <div style={{ textAlign: 'center', padding: theme.spacing.xl }}>
            <div style={{ fontSize: '3rem', marginBottom: theme.spacing.md }}>👥</div>
            <p>אין פוסטים מתאימים לסינון הנוכחי</p>
          </div>
        </Card>
      )}
      
      <Modal
        isOpen={isPostModalOpen}
        onClose={() => setIsPostModalOpen(false)}
        title="כתוב פוסט חדש"
        size="large"
      >
        <InputForm
          label="כותרת הפוסט"
          value={newPost.title}
          onChange={(e) => setNewPost(prev => ({ ...prev, title: e.target.value }))}
          placeholder="כתוב כותרת מעניינת..."
          required
        />
        
        <InputForm
          label="תוכן הפוסט"
          multiline
          rows={6}
          value={newPost.content}
          onChange={(e) => setNewPost(prev => ({ ...prev, content: e.target.value }))}
          placeholder="שתף את הניסיון שלך, שאל שאלות או תן עצות..."
          required
        />
        
        <InputForm
          label="תגיות (מופרדות בפסיקים)"
          value={newPost.tags}
          onChange={(e) => setNewPost(prev => ({ ...prev, tags: e.target.value }))}
          placeholder="לדוגמה: עגבניות, NFT, קציר"
        />
        
        <div style={{ display: 'flex', gap: theme.spacing.md, marginTop: theme.spacing.lg }}>
          <Button variant="primary" fullWidth onClick={handleCreatePost}>
            פרסם פוסט
          </Button>
          <Button variant="secondary" fullWidth onClick={() => setIsPostModalOpen(false)}>
            ביטול
          </Button>
        </div>
      </Modal>
      
      <Modal
        isOpen={isCommentModalOpen}
        onClose={() => setIsCommentModalOpen(false)}
        title="הוסף תגובה"
        size="medium"
      >
        {selectedPost && (
          <div>
            <div style={{ 
              marginBottom: theme.spacing.lg,
              padding: theme.spacing.md,
              backgroundColor: theme.colors.background.paper,
              borderRadius: theme.borderRadius.md
            }}>
              <h4 style={{ margin: 0, marginBottom: theme.spacing.sm }}>
                {selectedPost.title}
              </h4>
              <p style={{ color: theme.colors.text.secondary, fontSize: theme.typography.fontSize.sm }}>
                מאת {selectedPost.author}
              </p>
            </div>
            
            <InputForm
              label="התגובה שלך"
              multiline
              rows={4}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="כתוב תגובה מועילה..."
              required
            />
            
            <div style={{ display: 'flex', gap: theme.spacing.md, marginTop: theme.spacing.lg }}>
              <Button 
                variant="primary" 
                fullWidth 
                onClick={() => handleComment(selectedPost.id)}
              >
                הוסף תגובה
              </Button>
              <Button 
                variant="secondary" 
                fullWidth 
                onClick={() => setIsCommentModalOpen(false)}
              >
                ביטול
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
});

Community.displayName = 'Community';

export default Community;