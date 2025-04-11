import HashLoader from "react-spinners/HashLoader";
const Loading =  ({ loading, size ,color}) => {
  return (
    <div className="flex items-center justify-center">
      <HashLoader
        color={color} // Customize the color
        loading={loading}
        size={size} // Customize the size
        aria-label="Loading Spinner"
        data-testid="loader"
      />
    </div>
  )
}

export default Loading