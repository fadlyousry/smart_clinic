export function StatsCards({
    stats, reson }) {


    return (
        <>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {/* Stats Items */}
                {stats.map((stat, index) => (
                    <div key={index} className="bg-gray-100 rounded-xl shadow p-6 flex items-center justify-between">
                        <div>
                            <h3 className="text-gray-500 text-sm">{stat.title}</h3>
                            <div className="flex items-end gap-2 mt-1">
                                <span className="text-3xl font-bold text-gray-800">
                                    {stat.value}
                                </span>
                            </div>
                        </div>
                        <div className="bg-gray-100 p-2 rounded-full">{stat.icon}</div>
                    </div>
                ))}

                {/* Reson Items Container */}
                <div className="md:col-span-2 lg:col-span-1">
                    <div className="grid grid-cols-3 gap-4 h-full">
                        {reson.map((stat, index) => (
                            <div key={index} className="bg-gray-100 rounded-xl shadow p-6">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-gray-500 text-sm">{stat.title}</h3>
                                        <div className="flex items-end gap-2 mt-1">
                                            <span className="text-3xl font-bold text-gray-800">
                                                {stat.value}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="bg-gray-100 p-2 rounded-full ml-2">{stat.icon}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

        </>
    )
}
