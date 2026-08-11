import React, { useState } from 'react';
import { CommunityPost } from '../types';
import { Heart, MessageCircle, Share2, PlusCircle, User, Sparkles, Send } from 'lucide-react';
import { DataService } from '../lib/supabase';

interface InteractionsViewProps {
  posts: CommunityPost[];
  onPostsUpdated: (posts: CommunityPost[]) => void;
  onSuccessToast: (message: string) => void;
}

export const InteractionsView: React.FC<InteractionsViewProps> = ({
  posts,
  onPostsUpdated,
  onSuccessToast
}) => {
  const [newPostContent, setNewPostContent] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [isPosting, setIsPosting] = useState(false);

  const handleToggleLike = async (postId: string) => {
    const updated = await DataService.toggleLikePost(postId);
    onPostsUpdated(updated);
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostContent.trim()) return;

    setIsPosting(true);
    try {
      await DataService.addPost(newPostContent, authorName || 'Hermano de la Iglesia');
      const freshPosts = await DataService.getPosts();
      onPostsUpdated(freshPosts);
      onSuccessToast('¡Gracias por compartir tu testimonio con la comunidad!');
      setNewPostContent('');
      setAuthorName('');
    } catch (err) {
      console.error(err);
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <div className="space-y-10 pb-12">
      
      {/* Header Banner */}
      <div className="border-b border-[#e9e1df] pb-6">
        <span className="text-xs font-bold uppercase tracking-widest text-[#D4AF37]">
          Muro de la Comunidad
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#442a22] mt-1">
          Lo que amamos: Testimonios y Reflexiones
        </h1>
        <p className="text-sm text-[#504441] mt-2 max-w-2xl leading-relaxed">
          Un espacio público para compartir testimonios de bendición, palabras de ánimo y reflexiones sobre los mensajes de la semana.
        </p>
      </div>

      {/* Share Reflection Input Box */}
      <div className="rounded-3xl bg-[#faf2f0] border border-[#e9e1df] p-6 sm:p-8 space-y-4 shadow-sm">
        <div className="flex items-center gap-2 font-serif text-xl font-bold text-[#442a22]">
          <Sparkles className="w-5 h-5 text-[#D4AF37]" />
          <span>Compartir una Reflexión o Testimonio</span>
        </div>

        <form onSubmit={handleCreatePost} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#1e1b1a] uppercase tracking-wider mb-1">
                Tu Nombre
              </label>
              <input
                type="text"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder="Ej. María González (Opcional)"
                className="w-full px-4 py-2 rounded-xl bg-[#fff8f6] border border-[#e9e1df] text-sm text-[#1e1b1a] focus:outline-none focus:ring-2 focus:ring-[#442a22]"
              />
            </div>
          </div>

          <div>
            <textarea
              rows={3}
              required
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
              placeholder="¿Qué ha hecho Dios en tu vida esta semana? Comparte aquí..."
              className="w-full p-4 rounded-xl bg-[#fff8f6] border border-[#e9e1df] text-sm text-[#1e1b1a] focus:outline-none focus:ring-2 focus:ring-[#442a22] resize-none"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isPosting}
              className="px-6 py-2.5 rounded-full bg-[#442a22] text-[#fff8f6] font-semibold text-xs hover:bg-[#5d4037] shadow-md transition-all flex items-center gap-2"
            >
              <Send className="w-3.5 h-3.5 text-[#D4AF37]" />
              {isPosting ? 'Publicando...' : 'Publicar Testimonio'}
            </button>
          </div>
        </form>
      </div>

      {/* Posts Feed */}
      <div className="space-y-6">
        {posts.map((post) => (
          <div
            key={post.id}
            className="rounded-3xl bg-[#faf2f0] border border-[#e9e1df] p-6 sm:p-8 space-y-4 shadow-sm hover:border-[#442a22]/30 transition-all"
          >
            {/* Author bar */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {post.authorAvatar ? (
                  <img
                    src={post.authorAvatar}
                    alt={post.authorName}
                    className="w-10 h-10 rounded-full object-cover border border-[#e9e1df]"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-[#442a22] text-[#D4AF37] font-bold text-sm flex items-center justify-center">
                    {post.authorInitials || post.authorName.substring(0, 2).toUpperCase()}
                  </div>
                )}
                <div>
                  <h4 className="font-semibold text-sm text-[#1e1b1a]">
                    {post.authorName}
                  </h4>
                  <span className="text-xs text-[#75584d]">{post.timeAgo}</span>
                </div>
              </div>
            </div>

            {/* Post Content */}
            <p className="text-sm text-[#504441] leading-relaxed whitespace-pre-line">
              {post.content}
            </p>

            {/* Optional Image */}
            {post.imageUrl && (
              <div className="rounded-2xl overflow-hidden aspect-video bg-[#e9e1df] max-h-80">
                <img
                  src={post.imageUrl}
                  alt="Imagen del testimonio"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            )}

            {/* Interaction Footer */}
            <div className="pt-3 border-t border-[#e9e1df] flex items-center gap-6 text-xs text-[#75584d]">
              <button
                onClick={() => handleToggleLike(post.id)}
                className={`flex items-center gap-1.5 font-semibold transition-colors ${
                  post.userLiked ? 'text-rose-700' : 'hover:text-[#1e1b1a]'
                }`}
              >
                <Heart className={`w-4 h-4 ${post.userLiked ? 'fill-current text-rose-600' : ''}`} />
                <span>{post.likes} Amén / Me bendice</span>
              </button>

              <div className="flex items-center gap-1.5 font-medium">
                <MessageCircle className="w-4 h-4 text-[#75584d]" />
                <span>{post.repliesCount} comentarios</span>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
