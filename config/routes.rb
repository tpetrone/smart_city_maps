Rails.application.routes.draw do
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  root 'application#index'

  unless Rails.env.production?
    get '/spots/search' => 'mock/spots#search'
  end
end
