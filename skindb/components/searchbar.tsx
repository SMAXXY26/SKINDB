'use client';
import { Client } from 'pg'
import React, { useState, useEffect, useRef, useCallback } from 'react'

const Autocomplete=()=>{
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState(false);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const wrapperRef = useRef(null);

  const debounce = (func, delay) => {
    let timeoutId;
    return function(...args) {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      timeoutId = setTimeout(() => {
        func(...args);
      }, delay);
    };
  };

  const fetchSuggestions = async (searchQuery) => {
    if (searchQuery.length < 2) {
      setSuggestions([]);
      setIsDropdownVisible(false);
      return;
    }
    setIsLoading(true);
  };
}
