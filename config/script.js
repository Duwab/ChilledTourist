// idea would be to place parameters under the form __PARAM_NAME__ in
// subdirectories configuration files
// for each file, we would create a copy without .dist extension
// in which we would replace __PARAM_NAME__ by its value

/*
  Roughly, with the 2 first files, the script would build the 3rd one:
    >>> ./conf.js     (where we specify parameters manually)
      {
        "PARAM_NAME": <param-value>
      }
    >>> ../services/<service>/conf.(js|py).dist   (a template of config file)
      {
        "my_local_param_name": __PARAM_NAME__
      }
    >>> ../services/<service>/conf.(js|py)  (the service config auto-rendered)
      {
        "my_local_param_name": <param-value>
      }
*/
