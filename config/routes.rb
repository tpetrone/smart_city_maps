Rails.application.routes.draw do
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  root 'application#index'

  unless Rails.env.production?
    # Spots.
    get    '/spots/search'  => 'mock/spots#search'

    # Authentication and users.
    post   '/auth'          => 'mock/users#signup'
    post   '/auth/sign_in'  => 'mock/users#signin'
    post   '/auth/password' => 'mock/users#reset'
    put    '/auth/password' => 'mock/users#update'
    delete '/auth/sign_out' => 'mock/users#signout'

    # Checkins
    post '/checkins'          => 'mock/checkins#create'
    post '/checkins/checkout' => 'mock/checkins#checkout'
    get  '/checkins/pending'  => 'mock/checkins#pending'
  end
end
