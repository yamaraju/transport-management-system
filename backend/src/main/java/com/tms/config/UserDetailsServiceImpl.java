package com.tms.config;

import com.tms.models.User;
import com.tms.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Override
    @Transactional
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return userRepository.findByUsername(username)
                .or(() -> userRepository.findByEmail(username))
                .or(() -> userRepository.findFirstByName(username))
                .orElseThrow(() -> new UsernameNotFoundException("User Not Found with username, email, or name: " + username));
    }
}
