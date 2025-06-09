
def trace_network_paths(data):
    traced = []
    for segment in data:
        path = []
        for node in segment:
            if node.startswith("proxy_"):
                path.append("obscured_node")
            else:
                path.append(node)
        traced.append(path)
    return traced

def calculate_obscurity_index(paths):
    index = []
    for path in paths:
        obscurity = sum(1 for node in path if node == "obscured_node")
        index.append(obscurity / len(path))
    return index
