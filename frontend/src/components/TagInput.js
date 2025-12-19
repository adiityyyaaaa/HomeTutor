import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';

const TagInput = ({ label, placeholder, tags, setTags, error }) => {
    const [inputValue, setInputValue] = useState('');

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            addTag();
        }
    };

    const addTag = () => {
        const tag = inputValue.trim();
        if (tag && !tags.includes(tag)) {
            setTags([...tags, tag]);
            setInputValue('');
        }
    };

    const removeTag = (indexToRemove) => {
        setTags(tags.filter((_, index) => index !== indexToRemove));
    };

    return (
        <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {label}
            </label>
            <div className="flex flex-wrap gap-2 mb-2 p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus-within:ring-2 focus-within:ring-primary focus-within:border-transparent">
                {tags.map((tag, index) => (
                    <span key={index} className="flex items-center bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 px-3 py-1 rounded-full text-sm">
                        {tag}
                        <button
                            type="button"
                            onClick={() => removeTag(index)}
                            className="ml-2 hover:text-red-500 focus:outline-none"
                        >
                            <X className="w-3 h-3" />
                        </button>
                    </span>
                ))}
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onBlur={addTag}
                    className="flex-1 min-w-[120px] bg-transparent outline-none text-gray-700 dark:text-gray-200 placeholder-gray-400"
                    placeholder={tags.length === 0 ? placeholder : ''}
                />
            </div>
            <p className="text-xs text-gray-500 mb-1">Press Enter or comma to add</p>
            {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
        </div>
    );
};

export default TagInput;
